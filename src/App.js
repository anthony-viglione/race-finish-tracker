import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [finishers, setFinishers] = useState([]);
  const [showNameModal, setShowNameModal] = useState(false);
  const [currentFinisher, setCurrentFinisher] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedFinishers = localStorage.getItem('raceFinishers');
    if (savedFinishers) {
      setFinishers(JSON.parse(savedFinishers));
    }
  }, []);

  // Save finishers to localStorage whenever finishers change
  useEffect(() => {
    localStorage.setItem('raceFinishers', JSON.stringify(finishers));
  }, [finishers]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime(Date.now() - startTime);
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const startRace = () => {
    const now = Date.now();
    setStartTime(now);
    setCurrentTime(0);
    setIsRunning(true);
    setFinishers([]); // Clear previous race data
  };

  const stopRace = () => {
    setIsRunning(false);
  };

  const recordFinisher = () => {
    if (!isRunning) return;
    
    const finisher = {
      id: Date.now(),
      place: finishers.length + 1,
      time: currentTime,
      name: '',
      timestamp: Date.now()
    };
    
    setCurrentFinisher(finisher);
    setShowNameModal(true);
  };

  const saveFinisherName = (name) => {
    const updatedFinisher = { ...currentFinisher, name: name.trim() };
    setFinishers(prev => [...prev, updatedFinisher]);
    setShowNameModal(false);
    setCurrentFinisher(null);
  };

  const skipNameEntry = () => {
    const updatedFinisher = { ...currentFinisher, name: `Runner ${finishers.length + 1}` };
    setFinishers(prev => [...prev, updatedFinisher]);
    setShowNameModal(false);
    setCurrentFinisher(null);
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms}`;
  };

  const resetRace = () => {
    setIsRunning(false);
    setStartTime(null);
    setCurrentTime(0);
    setFinishers([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏃‍♂️ Race Finish Tracker</h1>
        <p>Simple timing for 5k races</p>
      </header>

      <main className="App-main">
        {/* Timer Display */}
        <div className="timer-section">
          <div className="timer-display">
            {formatTime(currentTime)}
          </div>
          
          <div className="timer-controls">
            {!isRunning ? (
              <button className="start-btn" onClick={startRace}>
                Start Race
              </button>
            ) : (
              <button className="stop-btn" onClick={stopRace}>
                Stop Race
              </button>
            )}
            
            {finishers.length > 0 && (
              <button className="reset-btn" onClick={resetRace}>
                Reset Race
              </button>
            )}
          </div>
        </div>

        {/* Finish Recording */}
        {isRunning && (
          <div className="finish-section">
            <button 
              className="finish-btn" 
              onClick={recordFinisher}
            >
              🏁 Record Finisher #{finishers.length + 1}
            </button>
          </div>
        )}

        {/* Results Display */}
        {finishers.length > 0 && (
          <div className="results-section">
            <h2>Race Results</h2>
            <div className="results-list">
              {finishers.map((finisher) => (
                <div key={finisher.id} className="result-item">
                  <span className="place">#{finisher.place}</span>
                  <span className="name">{finisher.name || 'Unnamed Runner'}</span>
                  <span className="time">{formatTime(finisher.time)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Name Entry Modal */}
      {showNameModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Enter Runner Name</h3>
            <input
              type="text"
              placeholder="Runner name (optional)"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  saveFinisherName(e.target.value);
                }
              }}
            />
            <div className="modal-buttons">
              <button onClick={() => saveFinisherName(document.querySelector('input').value)}>
                Save Name
              </button>
              <button onClick={skipNameEntry}>
                Skip (Add Later)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
