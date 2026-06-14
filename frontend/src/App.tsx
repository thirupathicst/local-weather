import { useState,useEffect } from 'react'

import './App.css'
import apiService from './services/apiService'

function App() {
    const [location, setLocation] = useState('')
    const [city, setCity] = useState('')
    const [dateTime, setDateTime] = useState('')
    const [weather, setWeather] = useState([])
    const [summary, setSummary] = useState([])

    useEffect(() => {
        setLocation('getting location...');
        setCity('getting city...');
        setDateTime(new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        }));
        handleClick();
    }, []);

    function getWeather(latitude: number, longitude: number) { 
        apiService.getCurrent(latitude, longitude).then((data) => {
            console.log('Weather data:', data);
            setWeather(data);
        });
    }

    function getSummary(latitude: number, longitude: number) {
        apiService.getSummary(latitude, longitude).then((data) => {
            console.log('Weather summary:', data);
            setSummary(data);
        });
    }

    function formatIST(date: Date, options = {}) {
        return new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short',
            ...options,
        }).format(date);
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

        return date.toLocaleDateString('en-US', {
            weekday: 'long',
        });
    }

    function handleClick() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                getLocationName(latitude, longitude);
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                getWeather(latitude, longitude);
                getSummary(latitude, longitude);
            }, error => {
                console.error('Error getting geolocation:', error);
            });
        }
    }

    function getLocationName(latitude: number, longitude: number) {
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then(response => response.json())
            .then(data => {
                console.log('Location data:', data);
                setLocation(`${data.display_name}`);
                setCity(`${data.name}`);
            });
    }
    
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLocation(event.target.value)
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
                        <div className="date">{dateTime}</div>
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
                    
                            <div className="hourly-card active">
                                <span className="hourly-time">Now</span>
                                <span className="hourly-icon">🌧️</span>
                                <span className="hourly-temp">68°</span>
                            </div>

                            <div className="hourly-card">
                                <span className="hourly-time">2 PM</span>
                                <span className="hourly-icon">🌧️</span>
                                <span className="hourly-temp">67°</span>
                            </div>

                            <div className="hourly-card">
                                <span className="hourly-time">3 PM</span>
                                <span className="hourly-icon">☁️</span>
                                <span className="hourly-temp">69°</span>
                            </div>

                            <div className="hourly-card">
                                <span className="hourly-time">4 PM</span>
                                <span className="hourly-icon">☁️</span>
                                <span className="hourly-temp">70°</span>
                            </div>

                            <div className="hourly-card">
                                <span className="hourly-time">5 PM</span>
                                <span className="hourly-icon">⛅</span>
                                <span className="hourly-temp">71°</span>
                            </div>

                            <div className="hourly-card">
                                <span className="hourly-time">6 PM</span>
                                <span className="hourly-icon">☀️</span>
                                <span className="hourly-temp">72°</span>
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
                            {summary.map((item: any, index) => {
                                return (
                                    <div key={index} className="forecast-row">
                                        <div className="day-name">{getDayLabel(item.timestamp)}</div>
                                        <div className="high-temp">{item.tempMaxC}°</div>
                                        <div className="low-temp">{item.tempMinC}°</div>
                                        {/* <div className="day-time">{new Date(item.timestamp).toDateString()}</div> */}
                                    </div>
                                )
                            })
                            }
                            <div className="forecast-row">
                                <div className="day-name">Today</div>
                                <div className="day-status"><span className="status-icon">🌧️</span><span>Rain</span></div>
                                <div className="high-temp">68°</div>
                                <div className="low-temp">55°</div>
                            </div>

                            <div className="forecast-row">
                                <div className="day-name">Tomorrow</div>
                                <div className="day-status"><span className="status-icon">⛅</span><span>Cloudy</span></div>
                                <div className="high-temp">72°</div>
                                <div className="low-temp">58°</div>
                            </div>

                            <div className="forecast-row">
                                <div className="day-name">Mon, Jun 8</div>
                                <div className="day-status"><span className="status-icon">☀️</span><span>Sunny</span></div>
                                <div className="high-temp">75°</div>
                                <div className="low-temp">60°</div>
                            </div>

                            <div className="forecast-row">
                                <div className="day-name">Tue, Jun 9</div>
                                <div className="day-status"><span className="status-icon">☀️</span><span>Sunny</span></div>
                                <div className="high-temp">78°</div>
                                <div className="low-temp">62°</div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default App
