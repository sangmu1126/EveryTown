import json

from flask import Flask, jsonify, request
import pymysql.cursors
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from eunjeon import Mecab
from tabulate import tabulate

app = Flask(__name__)

connection = pymysql.connect(host='localhost', port=3306, user='root', password='rootpassword', db='everytowndb',
                             charset='utf8', autocommit=True, cursorclass=pymysql.cursors.DictCursor)
cursor = connection.cursor()


@app.route('/restaurant', methods=['POST'])
def recommend_restaurant():
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    sql = get_restaurant_sql(lat, lon)
    cursor.execute(sql)
    result = cursor.fetchall()

    df = pd.DataFrame(result)
    df = preprocess_df(df)

    # 본문 Data 꺼내기
    data = request.get_json()
    selected_ids_str = data.get("id_list")
    selected_ids = [int(x) for x in selected_ids_str]

    # 사용자 선호 아이템 처리
    df_selected = df[df['id'].isin(selected_ids)]
    new_row = pd.DataFrame({'id': [0],
                            'menu': [' '.join(df_selected['menu'])],
                            'cate': [' '.join(df_selected['cate'])],
                            'tag': [' '.join(df_selected['tag'])],
                            'rating': [0],
                            'dist': [0],
                            })
    df = pd.concat([df, new_row], ignore_index=True)

    print(df[df['id'] == 0])

    sim_cate = get_cosine_sim(df, 'cate')
    sim_tag = get_cosine_sim(df, 'tag')
    sim_menu = get_cosine_sim(df, 'menu')

    # rating 정규화 (0에서 1 사이로)
    df['rating'] = (df['rating'] / 5)
    # dist 정규화 (0에서 1 사이로, dist가 작을수록 값이 큼)
    df['dist'] = 1 - (df['dist'] / 1000)

    place_sim = (
        + sim_cate * 0.3
        + sim_tag * 0.5
        + sim_menu * 1
        + np.repeat([df['rating'].values], len(df['rating']), axis=0) * 0.1
        + np.repeat([df['dist'].values], len(df['dist']), axis=0) * 0.1
    )

    place_sim_sorted_idx = place_sim.argsort()[:, ::-1]

    sim_place = find_sim_place(df, place_sim_sorted_idx, 0)
    sim_place_filtered = sim_place[~sim_place['id'].isin([0] + selected_ids)]
    sim_place_filtered['menu'] = sim_place_filtered['menu'].apply(lambda x: x[:15] + "..." if len(x) > 15 else x)
    print_place = sim_place_filtered[['id', 'name', 'category_middle_name', 'category_small_name', 'menu', 'rating', 'dist']].head(10)
    table = tabulate(print_place, headers='keys', tablefmt='pretty', showindex=False, stralign="left")
    print(table)

    response_data = [item['id'] for item in sim_place_filtered.head(10).to_dict(orient='records')]
    print(response_data)
    return jsonify(response_data)


@app.route('/place', methods=['POST'])
def recommend_place():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    middle_cate = request.args.get("cate")

    sql = get_place_sql(lat, lon, middle_cate)
    cursor.execute(sql)
    result = cursor.fetchall()

    df = pd.DataFrame(result)
    df = preprocess_df(df)

    # 본문 Data 꺼내기
    data = request.get_json()
    selected_ids_str = data.get("id_list")
    selected_ids = [int(x) for x in selected_ids_str]

    # 사용자 선호 아이템 처리
    df_selected = df[df['id'].isin(selected_ids)]
    new_row = pd.DataFrame({'id': [0],
                            'menu': [' '.join(df_selected['menu'])],
                            'cate': [' '.join(df_selected['cate'])],
                            'tag': [' '.join(df_selected['tag'])],
                            'rating': [0],
                            'dist': [0],
                            })
    df = pd.concat([df, new_row], ignore_index=True)

    print(df[df['id'] == 0])

    sim_cate = get_cosine_sim(df, 'cate')
    sim_tag = get_cosine_sim(df, 'tag')
    sim_menu = get_cosine_sim(df, 'menu')

    # rating 정규화 (0에서 1 사이로)
    df['rating'] = (df['rating'] / 5)
    # dist 정규화 (0에서 1 사이로, dist가 작을수록 값이 큼)
    df['dist'] = 1 - (df['dist'] / 1000)

    place_sim = (
        + sim_cate * 0.3
        + sim_tag * 0.5
        + sim_menu * 1
        + np.repeat([df['rating'].values], len(df['rating']), axis=0) * 0.1
        + np.repeat([df['dist'].values], len(df['dist']), axis=0) * 0.1
    )

    place_sim_sorted_idx = place_sim.argsort()[:, ::-1]

    sim_place = find_sim_place(df, place_sim_sorted_idx, 0)
    sim_place_filtered = sim_place[~sim_place['id'].isin([0] + selected_ids)]
    sim_place_filtered['menu'] = sim_place_filtered['menu'].apply(lambda x: x[:15] + "..." if len(x) > 15 else x)
    print_place = sim_place_filtered[['id', 'name', 'category_middle_name', 'category_small_name', 'menu', 'rating', 'dist']].head(10)
    table = tabulate(print_place, headers='keys', tablefmt='pretty', showindex=False, stralign="left")
    print(table)

    response_data = [item['id'] for item in sim_place_filtered.head(10).to_dict(orient='records')]
    print(response_data)
    return jsonify(response_data)


# 유사한 아이템 구하기
def find_sim_place(df, sorted_ind, place_id, top_n=30):
    place_title = df[df['id'] == place_id]
    place_index = place_title.index.values
    similar_indexes = sorted_ind[place_index, :(top_n)]
    similar_indexes = similar_indexes.reshape(-1)
    return df.iloc[similar_indexes]

# 코사인 유사도 구하기
def get_cosine_sim(df, col):
    count_vect = CountVectorizer(min_df=0.0, ngram_range=(1, 2))
    col_count = count_vect.fit_transform(df[col])
    sim_vect = cosine_similarity(col_count, col_count)
    return sim_vect

# dataframe 전처리
def preprocess_df(df):
    # mecab = Mecab(dicpath='C:/mecab/mecab-ko-dic')

    df['cate'] = df['category_middle_name'] + df['category_small_name']
    df['cate'] = df['cate'].str.replace('/', ' ')
    df['rating'] = df['rating'].astype(float)
    df['rating'] = df['rating'].fillna(2)
    
    if df['menu'].isnull().all():
        df['menu'] = df['menu'].fillna('메뉴')
    else:
        df['menu'] = df['menu'].fillna('')
    # df['menu'] = df['menu'].apply(lambda x: ' '.join(mecab.nouns(x)))
    
    if df['tag'].isnull().all():
        df['tag'] = df['tag'].fillna('태그')
    else:
        df['tag'] = df['tag'].fillna('')
    return df

def get_restaurant_sql(lat, lon):
    sql = "SELECT rest.id, rest.name, rest.category_middle_name, rest.category_small_name, rest.menu, rest.tag, AVG(rw.rating) AS rating, rest.dist " + \
          "FROM ( " + \
          "  SELECT res.*, GROUP_CONCAT(m.name ORDER BY m.id ASC SEPARATOR ' ') AS menu " + \
          "  FROM ( " + \
          "    SELECT r.*, GROUP_CONCAT(rt.tag ORDER BY rt.id ASC SEPARATOR ' ') AS tag, ST_Distance_Sphere(point(r.longitude, r.latitude), point(" + lon + ", " + lat + ")) AS dist " + \
          "    FROM restaurant r " + \
          "    LEFT JOIN restaurant_review_tag rt ON r.id = rt.restaurant_id " + \
          "    WHERE ST_Distance_Sphere(point(r.longitude, r.latitude), point(" + lon + ", " + lat + ")) <= 1000 " + \
          "    GROUP BY r.id " + \
          "  ) AS res " + \
          "  LEFT JOIN restaurant_menu m ON res.id = m.restaurant_id " + \
          "  GROUP BY res.id " + \
          ") AS rest " + \
          "LEFT JOIN restaurant_review rw ON rest.id = rw.restaurant_id " + \
          "GROUP BY rest.id"
    return sql
#9657 14576 17604


def get_place_sql(lat, lon, cate):
    sql = "SELECT pla.id, pla.name, pla.category_middle_name, pla.category_small_name, pla.menu, pla.tag, AVG(pw.rating) AS rating, pla.dist " + \
          "FROM ( " + \
          "  SELECT pl.*, GROUP_CONCAT(m.name ORDER BY m.id ASC SEPARATOR ' ') AS menu " + \
          "  FROM ( " + \
          "    SELECT p.*, GROUP_CONCAT(pt.tag ORDER BY pt.id ASC SEPARATOR ' ') AS tag, ST_Distance_Sphere(point(p.longitude, p.latitude), point(" + lon + ", " + lat + ")) AS dist " + \
          "    FROM place p " + \
          "    LEFT JOIN place_review_tag pt ON p.id = pt.place_id " + \
          "    WHERE ST_Distance_Sphere(point(p.longitude, p.latitude), point(" + lon + ", " + lat + ")) <= 1000 AND p.category_middle_code = \'" + cate + "\' " + \
          "    GROUP BY p.id " + \
          "  ) AS pl " + \
          "  LEFT JOIN place_menu m ON pl.id = m.place_id " + \
          "  GROUP BY pl.id " + \
          ") AS pla " + \
          "LEFT JOIN place_review pw ON pla.id = pw.place_id " + \
          "GROUP BY pla.id"
    return sql
