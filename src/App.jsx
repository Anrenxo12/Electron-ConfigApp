import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [areas, setAreas] = useState([]);

  // Function to handle login form submission
  const handleLogin = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    fetchAreasData();
  };

  // Function to fetch areas data from Electron's main process
  const fetchAreasData = async () => {
    if (window.electronAPI && window.electronAPI.fetchAreasData) {
      try {
        const data = await window.electronAPI.fetchAreasData();
        setAreas(data);
      } catch (error) {
        console.error('Failed to fetch areas:', error);
      }
    }
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        // UI after successful login
        <div className="Areas">
          <header className="Areas-header">
            <h1>Areas Data</h1>
            {areas.length === 0 ? (
              <p>No data available</p>
            ) : (
              areas.map((area, index) => (
                <div key={index}>
                  <h3>Area: {area.area}</h3>
                  <p>Type: {area.type}</p>
                  <div>Locations:</div>
                  <ul>
                    {area.locations.map((location, locIndex) => (
                      <li key={locIndex}>
                        Prefix: {location.prefix}
                        <ul>
                          {location.range.map((rangeItem, rangeIndex) => (
                            <li key={rangeIndex}>
                              {rangeItem.param}: {rangeItem.from} to {rangeItem.to}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </header>
        </div>
      ) : (
        // Login form UI
        <div className="Login">
          <h1>Authentication</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="userId">UserID</label>
              <input
                type="text"
                id="userId"
                placeholder="Enter UserID..."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Log In</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
