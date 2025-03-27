# MongoDB Setup for Waterloo Tinder

This guide will help you set up MongoDB for the Waterloo Tinder application.

## Prerequisites

1. Install MongoDB on your system:
   - **Windows**: [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux**: Follow [MongoDB installation guide](https://www.mongodb.com/docs/manual/administration/install-on-linux/)

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Database Configuration

1. Start MongoDB service:
   - **Windows**: MongoDB should run as a service after installation
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

2. Verify MongoDB is running:
   ```bash
   # Connect to MongoDB shell
   mongosh
   
   # Exit MongoDB shell
   exit
   ```

3. Configure your `.env` file:
   ```
   PORT=5000
   FLASK_ENV=development
   MONGO_URI=mongodb://localhost:27017/waterloo_tinder
   JWT_SECRET_KEY=use_a_secure_random_key_here
   ```

4. Start the application:
   ```bash
   # Navigate to the backend directory
   cd backend
   
   # Activate your virtual environment (if using one)
   # Windows:
   venv\Scripts\activate.bat
   # Unix/MacOS:
   source venv/bin/activate
   
   # Start the Flask server
   python app.py
   ```

## MongoDB Schema

The application uses the following MongoDB collections:

1. **users**: Stores user information including:
   - Authentication details (email, password hash)
   - Profile information (name, age, gender, etc.)
   - Location data (latitude, longitude)

2. **matches**: Tracks match requests and statuses:
   - user_id: ID of the user who initiated the match
   - matched_user_id: ID of the matched user
   - status: "pending", "accepted", or "rejected"
   - timestamps

## Advantages of MongoDB for This Application

1. **Flexible Schema**: Perfect for evolving user profiles
2. **Document-Based**: Stores related user data in a single document
3. **Geospatial Queries**: Built-in support for location-based features
4. **Scalability**: Easily scales horizontally for growing user base
5. **Performance**: Fast reads and writes for real-time interactions

## MongoDB Tools

If you want a GUI to manage your MongoDB database:
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Free official MongoDB GUI
- [Studio 3T](https://studio3t.com/) - More advanced features (free and paid versions) 