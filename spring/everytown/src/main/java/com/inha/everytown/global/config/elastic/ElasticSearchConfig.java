package com.inha.everytown.global.config.elastic;

import com.inha.everytown.global.converter.GeoPointToStringConverter;
import com.inha.everytown.global.converter.StringToGeoPointConverter;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.convert.ElasticsearchCustomConversions;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

import java.util.Arrays;

@Configuration
@EnableElasticsearchRepositories    //Elasticsearch Repository 허용
public class ElasticSearchConfig extends AbstractElasticsearchConfiguration {

    @Override
    public RestHighLevelClient elasticsearchClient() {
        String osHost = System.getenv("OS_HOST");
        if (osHost == null) {
            osHost = "localhost:9200";
        }
        
        ClientConfiguration.MaybeSecureClientConfigurationBuilder builder = ClientConfiguration.builder()
                .connectedTo(osHost);
        
        // AWS Managed OpenSearch usually ends with .es.amazonaws.com and requires SSL
        // Internal ECS ES container doesn't use SSL by default
        if (osHost.contains("amazonaws.com")) {
            builder.usingSsl();
        }
        
        return RestClients.create(builder.build()).rest();
    }

    @Bean
    public ElasticsearchCustomConversions elasticsearchCustomConversions() {
        return new ElasticsearchCustomConversions(
                Arrays.asList(new GeoPointToStringConverter(), new StringToGeoPointConverter())
        );
    }
}
