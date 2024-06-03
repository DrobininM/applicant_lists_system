import pymongo
import settings

client = pymongo.MongoClient(settings.DB_MONGO_URL)

mongo_db = client[settings.DB_NAME]
mongo_collection = mongo_db[settings.MONGO_COLLECTION_NAME]
