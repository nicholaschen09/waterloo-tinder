from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from database import mongo, format_document, format_documents
from datetime import datetime, timedelta
from bson.objectid import ObjectId
import math
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
user_bp = Blueprint('user', __name__, url_prefix='/api/users')
match_bp = Blueprint('match', __name__, url_prefix='/api/matches')

# Check if email is from University of Waterloo
def is_waterloo_email(email):
    return bool(re.match(r'^[\w.-]+@uwaterloo\.ca$', email))

# Authentication routes
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'password', 'name', 'age', 'gender']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Check if user already exists
    users = mongo.db.users
    if users.find_one({"email": data['email']}):
        return jsonify({"error": "Email already registered"}), 409
    
    # Create new user
    is_waterloo = is_waterloo_email(data['email'])
    user_data = {
        "email": data['email'],
        "password_hash": generate_password_hash(data['password']),
        "is_verified": False,  # Require email verification
        "is_waterloo_email": is_waterloo,
        "created_at": datetime.utcnow(),
        "profile": {
            "name": data['name'],
            "age": int(data['age']),
            "gender": data['gender'],
            "bio": data.get('bio', ''),
            "program": data.get('program', ''),
            "graduation_year": data.get('graduation_year'),
            "interests": data.get('interests', ''),
            "photos": data.get('photos', []),
            "last_active": datetime.utcnow()
        }
    }
    
    # Save to database
    result = users.insert_one(user_data)
    user_id = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(
        identity=user_id,
        expires_delta=timedelta(days=1)
    )
    
    return jsonify({
        "message": "User registered successfully",
        "user_id": user_id,
        "access_token": access_token,
        "is_waterloo": is_waterloo
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing email or password"}), 400
    
    users = mongo.db.users
    user = users.find_one({"email": data['email']})
    
    if not user or not check_password_hash(user['password_hash'], data['password']):
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Update last login timestamp
    users.update_one(
        {"_id": user['_id']},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Create access token
    access_token = create_access_token(
        identity=str(user['_id']),
        expires_delta=timedelta(days=1)
    )
    
    return jsonify({
        "message": "Login successful",
        "user_id": str(user['_id']),
        "access_token": access_token,
        "is_verified": user.get('is_verified', False),
        "is_waterloo": user.get('is_waterloo_email', False)
    }), 200

# User profile routes
@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    
    users = mongo.db.users
    user = users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    profile = user.get('profile', {})
    
    return jsonify({
        "id": str(user['_id']),
        "email": user['email'],
        "is_verified": user.get('is_verified', False),
        "is_waterloo": user.get('is_waterloo_email', False),
        "profile": {
            "name": profile.get('name', ''),
            "age": profile.get('age', 0),
            "gender": profile.get('gender', ''),
            "bio": profile.get('bio', ''),
            "interests": profile.get('interests', ''),
            "program": profile.get('program', ''),
            "graduation_year": profile.get('graduation_year'),
            "photos": profile.get('photos', []),
            "latitude": profile.get('latitude'),
            "longitude": profile.get('longitude'),
            "last_active": profile.get('last_active')
        }
    }), 200

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    users = mongo.db.users
    
    if not users.find_one({"_id": ObjectId(user_id)}):
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json()
    update_fields = {}
    
    # Update only provided fields
    field_mapping = {
        'name': 'profile.name',
        'age': 'profile.age',
        'gender': 'profile.gender',
        'bio': 'profile.bio',
        'interests': 'profile.interests',
        'program': 'profile.program',
        'graduation_year': 'profile.graduation_year',
        'photos': 'profile.photos',
        'latitude': 'profile.latitude',
        'longitude': 'profile.longitude'
    }
    
    for field, db_field in field_mapping.items():
        if field in data:
            update_fields[db_field] = data[field]
    
    # Always update last_active
    update_fields['profile.last_active'] = datetime.utcnow()
    
    users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields}
    )
    
    return jsonify({"message": "Profile updated successfully"}), 200

# Match finding routes
@match_bp.route('/potential', methods=['GET'])
@jwt_required()
def find_potential_matches():
    user_id = get_jwt_identity()
    users = mongo.db.users
    user = users.find_one({"_id": ObjectId(user_id)})
    
    if not user or 'profile' not in user:
        return jsonify({"error": "User profile not found"}), 404
    
    # Get query parameters
    max_distance = request.args.get('max_distance', 50, type=int)  # km
    min_age = request.args.get('min_age', 18, type=int)
    max_age = request.args.get('max_age', 100, type=int)
    gender = request.args.get('gender', None)
    limit = request.args.get('limit', 20, type=int)
    
    # Get current user's location
    my_profile = user.get('profile', {})
    my_lat = my_profile.get('latitude', 43.4723)  # Waterloo default
    my_lon = my_profile.get('longitude', -80.5449)  # Waterloo default
    
    # Build query for MongoDB
    query = {
        "_id": {"$ne": ObjectId(user_id)},
        "profile.age": {"$gte": min_age, "$lte": max_age}
    }
    
    if gender:
        query["profile.gender"] = gender
    
    # Find potential matches
    potential_users = list(users.find(query).limit(limit))
    
    # Calculate distances and filter
    matches = []
    for potential_user in potential_users:
        profile = potential_user.get('profile', {})
        
        # Calculate distance using Haversine formula
        user_lat = profile.get('latitude')
        user_lon = profile.get('longitude')
        
        # Skip if no location data
        if not user_lat or not user_lon:
            continue
            
        distance = haversine_distance(my_lat, my_lon, user_lat, user_lon)
        
        # Skip if too far
        if distance > max_distance:
            continue
        
        # Check match status
        matches_collection = mongo.db.matches
        match_status = None
        
        existing_match = matches_collection.find_one({
            "$or": [
                {"user_id": user_id, "matched_user_id": str(potential_user['_id'])},
                {"user_id": str(potential_user['_id']), "matched_user_id": user_id}
            ]
        })
        
        if existing_match:
            match_status = existing_match['status']
        
        matches.append({
            "user_id": str(potential_user['_id']),
            "name": profile.get('name', ''),
            "age": profile.get('age', 0),
            "gender": profile.get('gender', ''),
            "bio": profile.get('bio', ''),
            "program": profile.get('program', ''),
            "graduation_year": profile.get('graduation_year'),
            "photos": profile.get('photos', []),
            "distance": round(distance, 1),
            "match_status": match_status
        })
    
    # Sort by distance
    matches.sort(key=lambda x: x['distance'])
    
    return jsonify({
        "matches": matches,
        "count": len(matches)
    }), 200

@match_bp.route('/<target_user_id>', methods=['POST'])
@jwt_required()
def create_match(target_user_id):
    user_id = get_jwt_identity()
    
    # Prevent matching with self
    if user_id == target_user_id:
        return jsonify({"error": "Cannot match with yourself"}), 400
    
    # Check if target user exists
    users = mongo.db.users
    target_user = users.find_one({"_id": ObjectId(target_user_id)})
    if not target_user:
        return jsonify({"error": "Target user not found"}), 404
    
    # Check if match already exists
    matches_collection = mongo.db.matches
    existing_match = matches_collection.find_one({
        "$or": [
            {"user_id": user_id, "matched_user_id": target_user_id},
            {"user_id": target_user_id, "matched_user_id": user_id}
        ]
    })
    
    if existing_match:
        # If the current user was matched by the target user, update to accepted
        if existing_match['user_id'] == target_user_id and existing_match['matched_user_id'] == user_id:
            matches_collection.update_one(
                {"_id": existing_match['_id']},
                {"$set": {"status": "accepted", "updated_at": datetime.utcnow()}}
            )
            return jsonify({"message": "Match accepted!", "status": "accepted"}), 200
        
        # If current user already initiated, just return current status
        return jsonify({
            "message": f"Match already exists with status: {existing_match['status']}",
            "status": existing_match['status']
        }), 200
    
    # Create new match
    new_match = {
        "user_id": user_id,
        "matched_user_id": target_user_id,
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    matches_collection.insert_one(new_match)
    
    return jsonify({
        "message": "Match request sent",
        "status": "pending"
    }), 201

# Helper function for distance calculation
def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Radius of earth in kilometers
    return c * r 