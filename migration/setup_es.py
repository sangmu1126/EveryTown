import requests
import json
import time

ES_HOST = "http://elasticsearch.everytown.local:9200"

# 프로젝트 리소스로부터 공식 설정 읽기
with open("analysis-setting.json", "r") as f:
    analysis_settings = json.load(f)

with open("restaurant-mapping.json", "r") as f:
    restaurant_mapping = json.load(f)

with open("place-mapping.json", "r") as f:
    place_mapping = json.load(f)

def setup_indices():
    # ES가 뜰 때까지 잠시 대기
    print("Waiting for ES to be ready...")
    for _ in range(30):
        try:
            res = requests.get(ES_HOST)
            if res.status_code == 200:
                break
        except:
            pass
        time.sleep(5)

    for name, mapping in [("restaurant", restaurant_mapping), ("place", place_mapping)]:
        # 1. 기존 인덱스 삭제
        requests.delete(f"{ES_HOST}/{name}")
        print(f"Deleted index: {name}")

        # 2. 공식 설정과 매핑 합치기
        full_config = {
            "settings": analysis_settings,
            "mappings": mapping
        }

        # 3. 인덱스 생성
        res = requests.put(f"{ES_HOST}/{name}", json=full_config)
        print(f"Created index {name} with OFFICIAL mapping: {res.status_code}")
        if res.status_code != 200:
            print(res.text)

if __name__ == "__main__":
    setup_indices()
