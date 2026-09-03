import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const PROMPTS = [
    { label: '📝 Generate Cover Letter', value: 'cover_letter' },
    { label: '🎯 Interview Prep Tips', value: 'interview_prep' },
    { label: '💡 Resume Tips', value: 'resume_tips' },
    { label: '❓ Why Was I Rejected?', value: 'rejection_analysis' },
];

function AIAssistant() {
    const [selectedPrompt, setSelectedPrompt] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [role, setRole] = useState('');
    const [extraInfo, setExtraInfo] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const buildPrompt = () => {
        switch (selectedPrompt) {
            case 'cover_letter':
                return `Write a professional cover letter for the role of ${role} at ${companyName}. Additional info: ${extraInfo}. Keep it concise, professional and ATS-friendly.`;
            case 'interview_prep':
                return `Give me the top 10 interview questions and answers for the role of ${role} at ${companyName}. Focus on technical and behavioral questions. Additional context: ${extraInfo}`;
            case 'resume_tips':
                return `Give me specific resume improvement tips for applying to ${role} at ${companyName}. Additional info: ${extraInfo}. Be specific and actionable.`;
            case 'rejection_analysis':
                return `I was rejected for the role of ${role} at ${companyName}. Additional context: ${extraInfo}. What could be possible reasons and how can I improve for next time?`;
            default:
                return '';
        }
    };

    const handleGenerate = async () => {
        if (!selectedPrompt || !role || !companyName) {
            setError('Please fill in all fields!');
            return;
        }

        setError('');
        setLoading(true);
        setResponse('');

        try {
            const prompt = buildPrompt();

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: prompt,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            const data = await res.json();

            console.log('Gemini API Response:', data);

            if (!res.ok) {
                throw new Error(
                    data.error?.message || 'Failed to generate response'
                );
            }

            const text =
                data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error('No response received from AI');
            }

            setResponse(text);

        } catch (err) {
            console.error('Gemini Error:', err);
            setError(err.message || 'Failed to get AI response. Please try again!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-layout">
            <Navbar />
            <div className="main-content">
                <div className="dashboard">
                    <div className="dashboard-header">
                        <h2>AI Assistant 🤖</h2>
                    </div>

                    <div className="ai-container">
                        {/* Left — Input */}
                        <div className="ai-input-section">
                            <h3>What do you need help with?</h3>

                            <div className="prompt-grid">
                                {PROMPTS.map(p => (
                                    <button
                                        key={p.value}
                                        className={`prompt-btn ${selectedPrompt === p.value ? 'active' : ''}`}
                                        onClick={() => setSelectedPrompt(p.value)}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                            <input
                                className="ai-input"
                                type="text"
                                placeholder="Company Name *"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                            <input
                                className="ai-input"
                                type="text"
                                placeholder="Role / Position *"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <textarea
                                className="ai-textarea"
                                placeholder="Additional info (your skills, experience, job description etc.)"
                                value={extraInfo}
                                onChange={(e) => setExtraInfo(e.target.value)}
                                rows={4}
                            />

                            {error && <p className="error">{error}</p>}

                            <button
                                className="add-btn"
                                onClick={handleGenerate}
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : '✨ Generate'}
                            </button>
                        </div>

                        {/* Right — Output */}
                        <div className="ai-output-section">
                            <h3>AI Response</h3>
                            {loading && (
                                <div className="ai-loading">
                                    <p>🤖 AI is thinking...</p>
                                </div>
                            )}
                            {response && (
                                <div className="ai-response">
                                    <button
                                        className="copy-btn"
                                        onClick={() => navigator.clipboard.writeText(response)}
                                    >
                                        📋 Copy
                                    </button>
                                    <pre className="ai-response-text">{response}</pre>
                                </div>
                            )}
                            {!response && !loading && (
                                <div className="ai-empty">
                                    <p>🤖 Fill in the details and click Generate!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AIAssistant;