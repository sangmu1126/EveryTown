ARG ELASTIC_VERSION
FROM elasticsearch:${ELASTIC_VERSION}

COPY config/user_dic.txt config/user_dic.txt
COPY config/synonyms.txt config/synonyms.txt

RUN elasticsearch-plugin install analysis-nori