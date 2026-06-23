import { useState, useEffect } from 'react'
import './App.css'
import formattedDate from './utilites/localDateFormats'
import locationAccess from './utilites/locationAccess'
import apiService from './services/apiService'

function App() {
    const geo = locationAccess();

    const [location, setLocation] = useState('')
    const [city, setCity] = useState('')
    const [weather, setWeather] = useState([])
    const [summary, setSummary] = useState([])
    const [hourly, setHourly] = useState([])

    useEffect(() => {
        if (geo.loading) {
            setLocation('getting location...');
            setCity('getting city...');
        }
        
        if((geo.error as any)?.message) {
            setLocation((geo.error as any)?.message);
            setCity('Error getting city');
        }

        if (geo.coordinates.latitude !== 0 || geo.coordinates.longitude !== 0) {
            getLocationName(geo.coordinates.latitude, geo.coordinates.longitude);
        }

        //handleClick();
    }, [geo.coordinates.latitude, geo.coordinates.longitude, geo.loading, geo.error]);


    function getLocationName(latitude: number, longitude: number) {
        apiService.locationService(latitude, longitude).then((data) => {
            setLocation(`${data.display_name}`);
            setCity(`${data.name}`);
        });
    }

    function handleClick() {
        if (geo.coordinates.latitude !== 0 || geo.coordinates.longitude !== 0) {
            const { latitude, longitude } = geo.coordinates;
            getLocationName(latitude, longitude);
            getWeather(latitude, longitude);
            getSummary(latitude, longitude);
            getHourly(latitude, longitude);
        }
    }

    function getWeather(latitude: number, longitude: number) {
        apiService.getCurrent(latitude, longitude).then((data) => {
            setWeather(data);
        });
    }

    function getSummary(latitude: number, longitude: number) {
        apiService.getSummary(latitude, longitude).then((data) => {
            setSummary(data);
        });
    }

    function getHourly(latitude: number, longitude: number) {
        apiService.getHourly(latitude, longitude).then((data) => {
            setHourly(data);
        });
    }

    const getDayLabel = (timestamp: string) => {
        const date = new Date(timestamp);

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const dateStr = date.toDateString();

        if (dateStr === today.toDateString()) {
            return 'Today';
        }

        if (dateStr === tomorrow.toDateString()) {
            return 'Tomorrow';
        }

        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
        });
    }
    
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLocation(event.target.value)
    }

    function HourlyCard({ item, index }: { item: any; index: number }) {
        const timeOnly = formattedDate.useFormattedDate(item.timestamp, 'time');
        const { icon } = getWeatherStatus(item.rainfallMm, item.temperatureC);
        return (
            <div className={`hourly-card ${index === 0 ? 'active' : ''}`}>
                <span className="hourly-time">{timeOnly}</span>
                <span className="hourly-icon">{icon}</span>
                <span className="hourly-temp">{item.temperatureC}°</span>
            </div>
        );
    }

    function getWeatherStatus(rainfall: number, temperature: number) {
        if (rainfall > 1) {
            return { icon: '🌧️', label: 'Rain' };
        }
        if (rainfall > 0 && rainfall <= 0.9) {
            return { icon: '☁️', label: 'Cloudy' };
        }
        if (temperature >= 30) {
            return { icon: '☀️', label: 'Sunny' };
        }
        return { icon: '⛅', label: 'Cloudy' };
    }

    return (
        <>
            <div className="app-container">
                <div className="left-panel">
                    <div className="search-bar">
                        <input type="text" placeholder="Search location..." value={location} onChange={handleChange} />
                        <button onClick={handleClick}>🔍</button>
                    </div>
                    <div className="current-display">
                        <div className="location">{city}</div>
                        <div className="date">{formattedDate.getDate()}</div>
                        <div className="weather-hero">
                            68<span className="unit">°C</span>
                        </div>
                        <div className="condition-badge">🌧️ Light Rain</div>
                    </div>
                </div>

                <div className="right-panel">
                    <div>
                        <div className="section-title">Hourly Forecast</div>
                        <div className="hourly-container">
                            {
                                hourly.map((item: any, index) => {
                                    return <HourlyCard key={index} item={item} index={index} />
                                })
                            }
                            <div className="hourly-card active">
                                <span className="hourly-time">Now</span>
                                <span className="hourly-icon">🌧️</span>
                                <span className="hourly-temp">68°</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="section-title">Today's Details</div>
                        <div className="highlights-grid">
                            <div className="highlight-card">
                                <div className="highlight-label">Humidity</div>
                                <div className="highlight-value">78%</div>
                            </div>
                            <div className="highlight-card">
                                <div className="highlight-label">Wind speed</div>
                                <div className="highlight-value">12mph</div>
                            </div>
                            <div className="highlight-card">
                                <div className="highlight-label">Visibility</div>
                                <div className="highlight-value">6.2mi</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="section-title">Forecast</div>
                        <div className="forecast-list">
                            {
                                summary.map((item: any, index) => {
                                    const { icon, label } = getWeatherStatus(item.rainfallPercent, item.tempMaxC);
                                    return (
                                        <div key={index} className="forecast-row">
                                            <div className="day-name">{getDayLabel(item.timestamp)}</div>
                                            <div className="day-status"><span className="status-icon">{icon}</span><span>{label}</span></div>
                                            <div className="high-temp">{item.tempMaxC}°</div>
                                            <div className="low-temp">{item.tempMinC}°</div>
                                        </div>)
                                })
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
