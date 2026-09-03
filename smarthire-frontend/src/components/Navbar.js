import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const navItems = [
        { label: 'Dashboard', icon: '📊', path: '/dashboard' },
        { label: 'Applications', icon: '💼', path: '/dashboard' },
        { label: 'Browse Jobs', icon: '🌐', path: '/jobs' },
        { label: 'AI Assistant', icon: '🤖', path: '/ai' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-logo">⚡ SmartHire</div>
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <div
                        key={item.label}
                        className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;