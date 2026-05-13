import requests
import json

ES_HOST = "http://elasticsearch.everytown.local:9200"

def debug_es():
    try:
        # 1. 인덱스 목록 및 상태 확인
        print("--- Indices ---")
        indices = requests.get(f"{ES_HOST}/_cat/indices?v").text
        print(indices)

        # 2. 매핑 확인 (가장 중요)
        print("\n--- Mapping for 'restaurant' ---")
        mapping = requests.get(f"{ES_HOST}/restaurant/_mapping").json()
        print(json.dumps(mapping, indent=2))

        # 3. 데이터 1건 샘플 확인
        print("\n--- Sample Data ---")
        sample = requests.get(f"{ES_HOST}/restaurant/_search?size=1").json()
        print(json.dumps(sample, indent=2))

    except Exception as e:
        print(f"Debug failed: {e}")

if __name__ == "__main__":
    debug_es()
