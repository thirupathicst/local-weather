import { useState, useEffect } from 'react';

const useLocationAccess = () => {
    const [location, setLocation] = useState({
        loading: true,
        coordinates: { latitude: 0, longitude: 0 },
        error: {},        
    });
    const onSuccess = (location: GeolocationPosition) => {
        setLocation({
            loading: false,
            coordinates: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            },
            error: {},
        });
    };
    const onError = (error: any) => {
        setLocation({
            loading: false,
            coordinates: { latitude: 0, longitude: 0 },
            error: {
                code: error.code,
                message: error.message,
            }
        });
    };


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        } else {
            onError({ code: 0, message: 'Geolocation is not supported by this browser.' });
        }
    }, []);
    return location;
}

export default useLocationAccess;