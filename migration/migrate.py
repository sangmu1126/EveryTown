import mysql.connector
from elasticsearch import Elasticsearch, helpers
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MYSQL_CONFIG = {
    'host': 'terraform-20260512185237197700000003.crquyssi02m2.ap-northeast-2.rds.amazonaws.com',
    'user': 'admin',
    'password': 'EveryTown1234!',
    'database': 'everytowndb'
}

ES_HOST = "http://elasticsearch.everytown.local:9200"

def migrate():
    try:
        db = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = db.cursor(dictionary=True)
        es = Elasticsearch(ES_HOST)
        
        # --- 1. Restaurants 동기화 ---
        logger.info("Starting Restaurants sync...")
        # 백엔드 쿼리에 필요한 모든 필드를 가져옴
        cursor.execute("""
            SELECT id, name, address, 
                   category_large_code, category_large_name,
                   category_middle_code, category_middle_name,
                   category_small_code, category_small_name,
                   image, latitude, longitude 
            FROM restaurant
        """)
        restaurants = cursor.fetchall()
        
        actions = [
            {
                "_index": "restaurant",
                "_id": r['id'],
                "_source": {
                    "id": r['id'],
                    "name": r['name'],
                    "address": r['address'],
                    "category_large_code": r['category_large_code'],
                    "category_large_name": r['category_large_name'],
                    "category_middle_code": r['category_middle_code'],
                    "category_middle_name": r['category_middle_name'],
                    "category_small_code": r['category_small_code'],
                    "category_small_name": r['category_small_name'],
                    "tag": "default", # 백엔드 쿼리 필수값
                    "image": r['image'],
                    "location": {"lat": float(r['latitude']), "lon": float(r['longitude'])}
                }
            }
            for r in restaurants
        ]
        helpers.bulk(es, actions)
        logger.info(f"Successfully synced {len(actions)} restaurants.")

        # --- 2. Places 동기화 ---
        logger.info("Starting Places sync...")
        cursor.execute("""
            SELECT id, name, address, 
                   category_large_code, category_large_name,
                   category_middle_code, category_middle_name,
                   category_small_code, category_small_name,
                   image, latitude, longitude 
            FROM place
        """)
        places = cursor.fetchall()
        
        actions = [
            {
                "_index": "place",
                "_id": p['id'],
                "_source": {
                    "id": p['id'],
                    "name": p['name'],
                    "address": p['address'],
                    "category_large_code": p['category_large_code'],
                    "category_large_name": p['category_large_name'],
                    "category_middle_code": p['category_middle_code'],
                    "category_middle_name": p['category_middle_name'],
                    "category_small_code": p['category_small_code'],
                    "category_small_name": p['category_small_name'],
                    "tag": "default",
                    "image": p['image'],
                    "location": {"lat": float(p['latitude']), "lon": float(p['longitude'])}
                }
            }
            for p in places
        ]
        helpers.bulk(es, actions)
        logger.info(f"Successfully synced {len(actions)} places.")

    except Exception as e:
        logger.error(f"Migration failed: {e}")
    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

if __name__ == "__main__":
    migrate()
