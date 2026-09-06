import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    BarChart, Bar
} from 'recharts';

const COLORS = ['#6c63ff', '#4ade80', '#a78bfa', '#f87171'];

function Analytics() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        const res = await api.get('/api/jobs');
        setJobs(res.data);
    };

    // Status Distribution data
    const statusData = [
        { name: 'Applied', value: jobs.filter(j => j.status === 'APPLIED').length },
        { name: 'Interview', value: jobs.filter(j => j.status === 'INTERVIEW').length },
        { name: 'Offer', value: jobs.filter(j => j.status === 'OFFER').length },
        { name: 'Rejected', value: jobs.filter(j => j.status === 'REJECTED').length },
    ].filter(d => d.value > 0);

    // Applications over time data
    const timeData = () => {
        const grouped = {};
        jobs.forEach(job => {
            const date = job.appliedDate ? job.appliedDate.substring(0, 7) : 'Unknown';
            grouped[date] = (grouped[date] || 0) + 1;
        });
        return Object.entries(grouped)
            .sort()
            .map(([month, count]) => ({ month, count }));
    };

    // Top companies data
    const companyData = () => {
        const grouped = {};
        jobs.forEach(job => {
            grouped[job.companyName] = (grouped[job.companyName] || 0) + 1;
        });
        return Object.entries(grouped)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([company, count]) => ({ company, count }));
    };

    // Success rate
    const total = jobs.length;
    const interviews = jobs.filter(j => j.status === 'INTERVIEW' || j.status === 'OFFER').length;
    const offers = jobs.filter(j => j.status === 'OFFER').length;
    const interviewRate = total > 0 ? Math.round((interviews / total) * 100) : 0;
    const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0;

    return (
        <div className="app-layout">
            <Navbar />
            <div className="main-content">
                <div className="dashboard">
                    <div className="dashboard-header">
                        <h2>Analytics 📊</h2>
                    </div>

                    {jobs.length === 0 ? (
                        <p className="empty-state">Add some job applications to see analytics! 🚀</p>
                    ) : (
                        <>
                            {/* Success Rate Cards */}
                            <div className="analytics-rate-cards">
                                <div className="rate-card">
                                    <h3>{total}</h3>
                                    <p>Total Applications</p>
                                </div>
                                <div className="rate-card">
                                    <h3>{interviewRate}%</h3>
                                    <p>Interview Rate</p>
                                </div>
                                <div className="rate-card">
                                    <h3>{offerRate}%</h3>
                                    <p>Offer Rate</p>
                                </div>
                                <div className="rate-card">
                                    <h3>{interviews}</h3>
                                    <p>Interviews Secured</p>
                                </div>
                            </div>

                            {/* Charts Grid */}
                            <div className="analytics-grid">

                                {/* Applications Over Time */}
                                <div className="chart-card">
                                    <h3>Applications Over Time</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={timeData()}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#6c63ff22" />
                                            <XAxis dataKey="month" stroke="#8888aa" fontSize={12} />
                                            <YAxis stroke="#8888aa" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{ background: '#16213e', border: '1px solid #6c63ff44', borderRadius: '8px' }}
                                                labelStyle={{ color: '#e0e0ff' }}
                                            />
                                            <Line type="monotone" dataKey="count" stroke="#6c63ff" strokeWidth={2} dot={{ fill: '#6c63ff' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Status Distribution */}
                                <div className="chart-card">
                                    <h3>Status Distribution</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                labelLine={false}
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ background: '#16213e', border: '1px solid #6c63ff44', borderRadius: '8px' }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Top Companies */}
                                <div className="chart-card full-width">
                                    <h3>Top Companies Applied To</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={companyData()}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#6c63ff22" />
                                            <XAxis dataKey="company" stroke="#8888aa" fontSize={12} />
                                            <YAxis stroke="#8888aa" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{ background: '#16213e', border: '1px solid #6c63ff44', borderRadius: '8px' }}
                                                labelStyle={{ color: '#e0e0ff' }}
                                            />
                                            <Bar dataKey="count" fill="#6c63ff" radius={[6, 6, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Analytics;