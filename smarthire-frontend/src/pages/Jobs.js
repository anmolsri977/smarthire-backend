import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const CATEGORIES = [
    { label: 'Software Dev', value: 'software-dev' },
    { label: 'DevOps', value: 'devops-sysadmin' },
    { label: 'Data', value: 'data' },
    { label: 'Design', value: 'design' },
    { label: 'Product', value: 'product' },
];

const LOCATIONS = [
    { label: 'Worldwide', value: '' },
    { label: 'India', value: 'India' },
    { label: 'USA', value: 'USA' },
    { label: 'UK', value: 'UK' },
    { label: 'Canada', value: 'Canada' },
    { label: 'Europe', value: 'Europe' },
    { label: 'Remote', value: 'Remote' },
];

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('software-dev');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [error, setError] = useState('');

    const fetchJobs = async () => {
        setLoading(true);
        setError('');
        setJobs([]);
        try {
            let url = `https://remotive.com/api/remote-jobs?category=${selectedCategory}&limit=20`;

            const res = await fetch(url);
            const data = await res.json();

            let filtered = data.jobs;

            // Filter by search query
            if (searchQuery) {
                filtered = filtered.filter(job =>
                    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.company_name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            // Filter by location
            if (selectedLocation) {
                filtered = filtered.filter(job =>
                    job.candidate_required_location &&
                    job.candidate_required_location.toLowerCase().includes(selectedLocation.toLowerCase())
                );
            }

            setJobs(filtered);

            if (filtered.length === 0) {
                setError('No jobs found for selected filters. Try different options!');
            }

        } catch (err) {
            setError('Failed to fetch jobs. Please try again!');
        }
        setLoading(false);
    };

    const handleAddToTracker = async (job) => {
        try {
            await api.post('/api/jobs', {
                companyName: job.company_name,
                role: job.title,
                status: 'APPLIED',
                appliedDate: new Date().toISOString().split('T')[0],
                notes: `Applied via Remotive. Job URL: ${job.url}`
            });
            alert(`✅ ${job.company_name} added to your tracker!`);
        } catch (err) {
            alert('Failed to add job. Please try again!');
        }
    };

    return (
        <div className="app-layout">
            <Navbar />
            <div className="main-content">
                <div className="dashboard">
                    <div className="dashboard-header">
                        <h2>Browse Live Jobs 🌐</h2>
                    </div>

                    {/* Search + Filters */}
                    <div className="jobs-search-section">
                        <div className="jobs-search-row">
                            <input
                                className="search-input"
                                type="text"
                                placeholder="🔍 Search by role or company..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="jobs-filter-row">
                            <div className="filter-group">
                                <label>Category</label>
                                <select
                                    className="category-select"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Location</label>
                                <select
                                    className="category-select"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    {LOCATIONS.map(loc => (
                                        <option key={loc.value} value={loc.value}>
                                            {loc.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button className="add-btn search-jobs-btn" onClick={fetchJobs}>
                                🔍 Search Jobs
                            </button>
                        </div>
                    </div>

                    {loading && <p className="empty-state">Loading live jobs... ⏳</p>}
                    {error && <p className="empty-state">{error}</p>}

                    {!loading && jobs.length > 0 && (
                        <p className="jobs-count">Found {jobs.length} jobs</p>
                    )}

                    {!loading && jobs.length > 0 && (
                        <div className="live-jobs-grid">
                            {jobs.map(job => (
                                <div key={job.id} className="live-job-card">
                                    <div className="live-job-header">
                                        <div className="company-avatar">
                                            {job.company_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3>{job.title}</h3>
                                            <p className="role">{job.company_name}</p>
                                        </div>
                                    </div>
                                    <div className="live-job-details">
                                        {job.candidate_required_location && (
                                            <span className="job-tag">📍 {job.candidate_required_location}</span>
                                        )}
                                        {job.job_type && (
                                            <span className="job-tag">⏰ {job.job_type.replace('_', ' ')}</span>
                                        )}
                                        {job.salary && (
                                            <span className="job-tag">💰 {job.salary}</span>
                                        )}
                                    </div>
                                    <div className="live-job-actions">
                                        <a href={job.url} target="_blank" rel="noreferrer" className="view-btn">
                                            View Job
                                        </a>
                                        <button className="track-btn" onClick={() => handleAddToTracker(job)}>
                                            + Track It
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && jobs.length === 0 && !error && (
                        <p className="empty-state">
                            Select filters and click "Search Jobs" to browse opportunities! 🚀
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Jobs;