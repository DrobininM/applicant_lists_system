import os

from dotenv import load_dotenv

load_dotenv()

PORT = os.getenv('PORT', default=8000)

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
DB_PORT = os.getenv('DB_PORT')
MONGO_COLLECTION_NAME = os.getenv('MONGO_COLLECTION_NAME')

DB_POSTGRES_URL = os.getenv('DB_POSTGRES_URL')
DB_MONGO_URL = os.getenv('DB_MONGO_URL')
