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

  return (
    <div>
      <Navbar />
      <div className="dashboard">
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

        {showForm && (
          <div className="job-form">
            <h3>{editId ? 'Edit Job' : 'Add New Job'}</h3>
            <input
              name="companyName"
              placeholder="Company Name"
              value={form.companyName}
              onChange={handleChange}
            />
            <input
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
            />
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="APPLIED">APPLIED</option>
              <option value="INTERVIEW">INTERVIEW</option>
              <option value="OFFER">OFFER</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <input
              name="appliedDate"
              type="date"
              value={form.appliedDate}
              onChange={handleChange}
            />
            <input
              name="notes"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={handleChange}
            />
            <div className="form-buttons">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {jobs.length === 0 ? (
          <p className="empty-state">No job applications yet. Click "+ Add Job" to get started! 🚀</p>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;