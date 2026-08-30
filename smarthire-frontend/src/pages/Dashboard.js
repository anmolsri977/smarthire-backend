import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import api from '../api/axios';

const emptyForm = {
  companyName: '', role: '', status: 'APPLIED', appliedDate: '', notes: ''
};

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await api.get('/api/jobs');
    setJobs(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (editId) {
      await api.put(`/api/jobs/${editId}`, form);
    } else {
      await api.post('/api/jobs', form);
    }
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    fetchJobs();
  };

  const handleEdit = (job) => {
    setForm({
      companyName: job.companyName,
      role: job.role,
      status: job.status,
      appliedDate: job.appliedDate,
      notes: job.notes || ''
    });
    setEditId(job.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/jobs/${id}`);
    fetchJobs();
  };

  // Follow-up reminder — jobs older than 7 days with APPLIED status
  const needsFollowUp = (job) => {
    if (job.status !== 'APPLIED') return false;
    const applied = new Date(job.appliedDate);
    const today = new Date();
    const diff = Math.floor((today - applied) / (1000 * 60 * 60 * 24));
    return diff >= 7;
  };

  // Filter + Search
  const filteredJobs = jobs
      .filter(job => filterStatus === 'ALL' || job.status === filterStatus)
      .filter(job => job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.role.toLowerCase().includes(searchQuery.toLowerCase()));

  // Stats
  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === 'APPLIED').length,
    interview: jobs.filter(j => j.status === 'INTERVIEW').length,
    offer: jobs.filter(j => j.status === 'OFFER').length,
    rejected: jobs.filter(j => j.status === 'REJECTED').length,
  };

  return (
      <div>
        <Navbar />
        <div className="dashboard">

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card total">
              <h3>{stats.total}</h3>
              <p>Total Applications</p>
            </div>
            <div className="stat-card applied">
              <h3>{stats.applied}</h3>
              <p>Applied</p>
            </div>
            <div className="stat-card interview">
              <h3>{stats.interview}</h3>
              <p>Interviews</p>
            </div>
            <div className="stat-card offer">
              <h3>{stats.offer}</h3>
              <p>Offers</p>
            </div>
            <div className="stat-card rejected">
              <h3>{stats.rejected}</h3>
              <p>Rejected</p>
            </div>
          </div>

          {/* Header */}
          <div className="dashboard-header">
            <h2>My Job Applications 💼</h2>
            <button className="add-btn" onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm(emptyForm);
            }}>
              + Add Job
            </button>
          </div>

          {/* Search + Filter */}
          <div className="search-filter">
            <input
                className="search-input"
                type="text"
                placeholder="🔍 Search by company or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="filter-buttons">
              {['ALL', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'].map(status => (
                  <button
                      key={status}
                      className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                      onClick={() => setFilterStatus(status)}
                  >
                    {status}
                  </button>
              ))}
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
              <div className="job-form">
                <h3>{editId ? 'Edit Job' : 'Add New Job'}</h3>
                <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} />
                <input name="role" placeholder="Role" value={form.role} onChange={handleChange} />
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="APPLIED">APPLIED</option>
                  <option value="INTERVIEW">INTERVIEW</option>
                  <option value="OFFER">OFFER</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
                <input name="appliedDate" type="date" value={form.appliedDate} onChange={handleChange} />
                <input name="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleChange} />
                <div className="form-buttons">
                  <button className="save-btn" onClick={handleSave}>Save</button>
                  <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </div>
          )}

          {/* Jobs Grid */}
          {filteredJobs.length === 0 ? (
              <p className="empty-state">No job applications found. Click "+ Add Job" to get started! 🚀</p>
          ) : (
              <div className="jobs-grid">
                {filteredJobs.map(job => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        needsFollowUp={needsFollowUp(job)}
                    />
                ))}
              </div>
          )}
        </div>
      </div>
  );
}

export default Dashboard;