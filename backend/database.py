from flask_pymongo import PyMongo
from bson.objectid import ObjectId

# Initialize PyMongo
mongo = PyMongo()

# Helper functions for working with MongoDB
def format_document(doc):
    """Format MongoDB document by converting ObjectId to string"""
    if doc is None:
        return None
    
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    
    return doc

def format_documents(docs):
    """Format multiple MongoDB documents"""
    return [format_document(doc) for doc in docs] 