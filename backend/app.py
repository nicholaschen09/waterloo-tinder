from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from database import mongo
import os
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure app
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# Configure CORS
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

# Initialize extensions
mongo.init_app(app)
jwt = JWTManager(app)

# Register blueprints
from routes import auth_bp, user_bp, match_bp
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(match_bp)

# Basic route for testing
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "database": "MongoDB",
        "connection": "connected" if mongo.db is not None else "disconnected"
    })

# Add initial admin user if not exists
def init_db():
    users = mongo.db.users
    # Check if admin user exists
    if users.count_documents({"email": "admin@waterloo.ca"}) == 0:
        # Create admin user
        users.insert_one({
            "email": "admin@waterloo.ca",
            "password_hash": "pbkdf2:sha256:600000$VCOBtDSbFrYPQJ69$2e0b8ef3ae2bfa3de9de3f3bfdbe3e1a8f9cf71ac40e6c6ca90535d714a89f50",  # "admin"
            "is_verified": True,
            "is_waterloo_email": True,
            "created_at": datetime.utcnow()
        })
        print("Admin user created")

if __name__ == '__main__':
    with app.app_context():
        init_db()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 