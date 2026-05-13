// LocationInfo.js
import React, { useEffect, useState } from 'react';
import './LocationInfo.css';

import { useLocation } from './LocationContext'; // LocationContext 훅 임포트

const LocationInfo = () => {
    const { location, setLocation } = useLocation(); // 전역 위치 상태 사용

    useEffect(() => {
        if (!location.lat || !location.lon) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
                        const geocoder = new window.kakao.maps.services.Geocoder();
                        const callback = function(result, status) {
                            if (status === window.kakao.maps.services.Status.OK) {
                                const address = result[0].address;
                                setLocation({ lat: position.coords.latitude, lon: position.coords.longitude, address: `${address.region_2depth_name} ${address.region_3depth_name}` });
                            }
                        };
                        geocoder.coord2Address(position.coords.longitude, position.coords.latitude, callback);
                    } else {
                        // 카카오 지도가 없을 경우 좌표만이라도 저장
                        setLocation({ lat: position.coords.latitude, lon: position.coords.longitude, address: '위치 정보 로드 중...' });
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        }
    }, [location, setLocation]);

    return <div>{location.address}</div>;
}

export default LocationInfo;