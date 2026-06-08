import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  function handleClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      }, error => {
        console.error('Error getting geolocation:', error);
      });
    }
  }

  return (
    <>
     <div className="app-container">
        
        <div className="left-panel">
            <div className="search-bar">
                <input type="text" placeholder="Search location..." value="New York"/>
                <button onClick={handleClick}>🔍</button>
            </div>

            <div className="current-display">
                <div className="location">New York, US</div>
                <div className="date">Saturday, June 6</div>
                <div className="weather-hero">
                    68<span className="unit">°F</span>
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
