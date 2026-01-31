import React from "react";
import { useNavigate } from "react-router-dom";

import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-memory-wrapper">
      <div className="polaroid-container">
        {/* Floating polaroids in background */}
        <div className="floating-polaroid polaroid-1"></div>
        <div className="floating-polaroid polaroid-2"></div>
        <div className="floating-polaroid polaroid-3"></div>
        
        {/* Main content polaroid */}
        <div className="main-polaroid">
          <div className="polaroid-photo">
            <div className="glitch-number" data-text="404">404</div>
            <div className="memory-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div className="polaroid-caption">
            <h2 className="memory-title">Memory Not Found</h2>
            <p className="memory-text">
              This page seems to have faded away... 
              <br/>
              Let's get you back to your cherished memories
            </p>
            
            <button 
              className="return-btn"
              onClick={() => navigate("/")}
            >
              <span className="btn-icon">📸</span>
              <span className="btn-text">Back to Memories</span>
            </button>
          </div>
        </div>
        
        {/* Decorative hearts */}
        <div className="heart heart-1">♥</div>
        <div className="heart heart-2">♥</div>
        <div className="heart heart-3">♥</div>
      </div>
    </div>
  );
}

export default NotFound;