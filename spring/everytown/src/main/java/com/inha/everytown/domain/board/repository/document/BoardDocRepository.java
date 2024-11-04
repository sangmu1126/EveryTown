package com.inha.everytown.domain.board.repository.document;

import com.inha.everytown.domain.board.entity.document.BoardDoc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface BoardDocRepository extends ElasticsearchRepository<BoardDoc, Long> {

    @Query("{" +
            "    \"bool\": {" +
            "        \"must\": [" +
            "            {" +
            "                \"multi_match\": {" +
            "                    \"query\": \"?0\"," +
            "                    \"fields\": [" +
            "                        \"title\"," +
            "                        \"nickname\"," +
            "                        \"content\"" +
            "                    ]," +
            "                    \"type\": \"most_fields\"," +
            "                    \"operator\": \"or\"" +
            "                }" +
            "            }," +
            "            {" +
            "                \"match\": {" +
            "                    \"board_category_id\": \"?1\"" +
            "                }" +
            "            }" +
            "        ]," +
            "        \"filter\": {" +
            "            \"geo_distance\": {" +
            "                \"distance\": \"1km\"," +
            "                \"location\": {" +
            "                    \"lat\": ?2," +
            "                    \"lon\": ?3" +
            "                }" +
            "            }" +
            "        }" +
            "    }" +
            "}")
    Page<BoardDoc> findByQueryWithCate(String query, Long cateId, double lat, double lon, Pageable pageable);

    @Query("{" +
            "    \"bool\": {" +
            "        \"must\": [" +
            "            {" +
            "                \"multi_match\": {" +
            "                    \"query\": \"?0\"," +
            "                    \"fields\": [" +
            "                        \"title\"," +
            "                        \"nickname\"," +
            "                        \"content\"" +
            "                    ]," +
            "                    \"type\": \"most_fields\"," +
            "                    \"operator\": \"or\"" +
            "                }" +
            "            }" +
            "        ]," +
            "        \"filter\": {" +
            "            \"geo_distance\": {" +
            "                \"distance\": \"1km\"," +
            "                \"location\": {" +
            "                    \"lat\": ?1," +
            "                    \"lon\": ?2" +
            "                }" +
            "            }" +
            "        }" +
            "    }" +
            "}")
    Page<BoardDoc> findByQuery(String query, double lat, double lon, Pageable pageable);
}
