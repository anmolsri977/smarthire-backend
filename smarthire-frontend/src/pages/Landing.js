import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../hero.jpg';

function Landing() {
    const navigate = useNavigate();

    return (
        <div
            className="landing-container"
            style={{
                backgroundImage: `url(${heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="landing-overlay">
                <div className="landing-content">
                    <div className="landing-logo">⚡ SmartHire</div>
                    <h1 className="landing-title">Track Your Career Journey</h1>
                    <p className="landing-subtitle">
                        Manage all your job applications in one place. <br />
                        Never miss a follow-up. Land your dream job.
                    </p>
                    <div className="landing-buttons">
                        <button className="landing-btn-primary" onClick={() => navigate('/register')}>
                            Get Started
                        </button>
                        <button className="landing-btn-secondary" onClick={() => navigate('/login')}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;