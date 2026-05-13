package com.inha.everytown.domain.etc.admin.controller;

import com.inha.everytown.domain.place.entity.document.PlaceDoc;
import com.inha.everytown.domain.place.entity.relation.Place;
import com.inha.everytown.domain.place.repository.document.PlaceDocRepository;
import com.inha.everytown.domain.place.repository.relation.PlaceRepository;
import com.inha.everytown.domain.restaurant.entity.document.RestaurantDoc;
import com.inha.everytown.domain.restaurant.entity.relation.Restaurant;
import com.inha.everytown.domain.restaurant.repository.document.RestaurantDocRepository;
import com.inha.everytown.domain.restaurant.repository.relation.RestaurantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/sync")
public class AdminSyncController {

    private static final Logger log = LoggerFactory.getLogger(AdminSyncController.class);

    private final RestaurantRepository restaurantRepository;
    private final RestaurantDocRepository restaurantDocRepository;
    private final PlaceRepository placeRepository;
    private final PlaceDocRepository placeDocRepository;

    public AdminSyncController(RestaurantRepository restaurantRepository, 
                                RestaurantDocRepository restaurantDocRepository,
                                PlaceRepository placeRepository,
                                PlaceDocRepository placeDocRepository) {
        this.restaurantRepository = restaurantRepository;
        this.restaurantDocRepository = restaurantDocRepository;
        this.placeRepository = placeRepository;
        this.placeDocRepository = placeDocRepository;
    }

    @GetMapping("/restaurants")
    public String syncRestaurants() {
        log.info("Starting Restaurant Sync...");
        List<Restaurant> restaurants = restaurantRepository.findAll();
        
        List<RestaurantDoc> docs = restaurants.stream().map(r -> {
            RestaurantDoc doc = RestaurantDoc.builder()
                    .id(r.getId())
                    .name(r.getName())
                    .address(r.getAddress())
                    .categorySmallName(r.getCategorySmallName())
                    .image(r.getImage())
                    .location(new GeoPoint(r.getLatitude().doubleValue(), r.getLongitude().doubleValue()))
                    .build();
            return doc;
        }).collect(Collectors.toList());

        restaurantDocRepository.saveAll(docs);
        log.info("Sync Completed! {} restaurants synced.", docs.size());
        return "Synced " + docs.size() + " restaurants successfully!";
    }

    @GetMapping("/places")
    public String syncPlaces() {
        log.info("Starting Place Sync...");
        List<Place> places = placeRepository.findAll();
        
        List<PlaceDoc> docs = places.stream().map(p -> {
            PlaceDoc doc = PlaceDoc.builder()
                    .id(p.getId())
                    .name(p.getName())
                    .address(p.getAddress())
                    .categorySmallName(p.getCategorySmallName())
                    .image(p.getImage())
                    .location(new GeoPoint(p.getLatitude().doubleValue(), p.getLongitude().doubleValue()))
                    .build();
            return doc;
        }).collect(Collectors.toList());

        placeDocRepository.saveAll(docs);
        log.info("Sync Completed! {} places synced.", docs.size());
        return "Synced " + docs.size() + " places successfully!";
    }
}
