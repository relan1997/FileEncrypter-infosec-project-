
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="content">
        <h1 className="title">File Encryption System</h1>
        <p className="subtitle">Choose what you want to do with your files</p>
        
        <div className="cards-container">
          <div 
            className="card encrypt-card"
            onClick={() => navigate('/encrypt')}
          >
            <div className="card-content">
              <i className="fas fa-lock icon"></i>
              <h2>Encrypt Files</h2>
              <p>Secure your files with strong encryption</p>
              <button className="action-button">
                Get Started
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div 
            className="card decrypt-card"
            onClick={() => navigate('/decrypt')}
          >
            <div className="card-content">
              <i className="fas fa-unlock icon"></i>
              <h2>Decrypt Files</h2>
              <p>Access your encrypted files</p>
              <button className="action-button">
                Get Started
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <footer className="footer">
          <p>Secure • Fast • Reliable</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;