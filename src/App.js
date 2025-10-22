import React, { useState, useEffect } from 'react';
import './App.css';
import jsPDF from 'jspdf';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [finishers, setFinishers] = useState([]);
  const [showNameModal, setShowNameModal] = useState(false);
  const [currentFinisher, setCurrentFinisher] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFinisher, setEditingFinisher] = useState(null);

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

  const startEditRunner = (finisher) => {
    setEditingFinisher(finisher);
    setShowEditModal(true);
  };

  const saveEditedName = (newName) => {
    setFinishers(prev => prev.map(finisher => 
      finisher.id === editingFinisher.id 
        ? { ...finisher, name: newName.trim() || `Runner ${finisher.place}` }
        : finisher
    ));
    setShowEditModal(false);
    setEditingFinisher(null);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setEditingFinisher(null);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Race Results', 20, 30);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 45);
    
    // Add results table
    doc.setFontSize(14);
    doc.text('Place', 20, 65);
    doc.text('Name', 50, 65);
    doc.text('Time', 120, 65);
    
    // Add line separator
    doc.line(20, 70, 190, 70);
    
    // Add each finisher
    let yPosition = 80;
    finishers.forEach((finisher, index) => {
      if (yPosition > 270) { // Start new page if needed
        doc.addPage();
        yPosition = 30;
        // Re-add headers on new page
        doc.setFontSize(14);
        doc.text('Place', 20, yPosition);
        doc.text('Name', 50, yPosition);
        doc.text('Time', 120, yPosition);
        doc.line(20, yPosition + 5, 190, yPosition + 5);
        yPosition = 40;
      }
      
      doc.setFontSize(12);
      doc.text(`#${finisher.place}`, 20, yPosition);
      doc.text(finisher.name || 'Unnamed Runner', 50, yPosition);
      doc.text(formatTime(finisher.time), 120, yPosition);
      
      yPosition += 15;
    });
    
    // Save the PDF
    doc.save('race-results.pdf');
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
            <div className="results-header">
              <h2>Race Results</h2>
              <button className="download-btn" onClick={downloadPDF}>
                📄 Download PDF
              </button>
            </div>
            <div className="results-list">
              {finishers.map((finisher) => (
                <div key={finisher.id} className="result-item">
                  <span className="place">#{finisher.place}</span>
                  <span 
                    className="name clickable-name" 
                    onClick={() => startEditRunner(finisher)}
                    title="Click to edit name"
                  >
                    {finisher.name || 'Unnamed Runner'}
                  </span>
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

      {/* Edit Name Modal */}
      {showEditModal && editingFinisher && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Runner Name</h3>
            <input
              type="text"
              placeholder="Runner name"
              defaultValue={editingFinisher.name}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  saveEditedName(e.target.value);
                }
              }}
            />
            <div className="modal-buttons">
              <button onClick={() => saveEditedName(document.querySelector('input').value)}>
                Save Changes
              </button>
              <button onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
