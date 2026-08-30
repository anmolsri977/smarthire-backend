import React from 'react';

function JobCard({ job, onEdit, onDelete, needsFollowUp }) {
    return (
        <div className={`job-card ${needsFollowUp ? 'followup-warning' : ''}`}>
            {needsFollowUp && (
                <div className="followup-badge">⚠️ Follow up — Applied 7+ days ago!</div>
            )}
            <h3>{job.companyName}</h3>
            <p className="role">{job.role}</p>
            <p className="date">📅 {job.appliedDate}</p>
            {job.notes && <p className="notes">📝 {job.notes}</p>}
            <span className={`status-badge status-${job.status}`}>
        {job.status}
      </span>
            <div className="card-actions">
                <button className="edit-btn" onClick={() => onEdit(job)}>Edit</button>
                <button className="delete-btn" onClick={() => onDelete(job.id)}>Delete</button>
            </div>
        </div>
    );
}

export default JobCard;