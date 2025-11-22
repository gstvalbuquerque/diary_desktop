import { useState, useEffect } from 'react';
import { GetEntry, SaveEntry, DeleteEntry } from "../wailsjs/go/main/App";

const TrashIcon = ({ onClick }) => (
    <button className="btn-icon" onClick={onClick} title="Delete Entry">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    </button>
);

const StarIcon = () => (
    <svg
        className="decorative-star"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
    </svg>
);

export default function EntryEditor({ date, onBack }) {
    const [morning, setMorning] = useState('');
    const [afternoon, setAfternoon] = useState('');
    const [evening, setEvening] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        loadEntry();
    }, [date]);

    const loadEntry = async () => {
        try {
            const entry = await GetEntry(date);
            if (entry) {
                setMorning(entry.morning || '');
                setAfternoon(entry.afternoon || '');
                setEvening(entry.evening || '');
            } else {
                // Reset fields if no entry found (important if reusing component)
                setMorning('');
                setAfternoon('');
                setEvening('');
            }
        } catch (err) {
            console.error("Failed to load entry:", err);
        }
    };

    const handleSaveAll = async () => {
        setStatus('Saving...');
        try {
            await SaveEntry(date, 'morning', morning);
            await SaveEntry(date, 'afternoon', afternoon);
            await SaveEntry(date, 'evening', evening);

            setStatus('Saved');
            setTimeout(() => setStatus(''), 2000);
        } catch (err) {
            setStatus('Error saving');
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this entry?')) {
            await DeleteEntry(date);
            onBack();
        }
    };

    const formatDate = (dateStr) => {
        // dateStr is DD-MM-YYYY
        const [d, m, y] = dateStr.split('-');
        const dateObj = new Date(y, m - 1, d);
        return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="editor-container">
            <div className="editor-card">
                <header className="editor-header">
                    <button className="back-link" onClick={onBack}>
                        &larr; Back to Dashboard
                    </button>
                    <TrashIcon onClick={handleDelete} />
                </header>

                <h2 className="entry-title">Entry for {formatDate(date)}</h2>

                <div className="editor-scroll-area">
                    <div className="editor-section">
                        <h3>Morning</h3>
                        <textarea
                            value={morning}
                            onChange={(e) => setMorning(e.target.value)}
                            placeholder="How did your day start?"
                        />
                    </div>

                    <div className="editor-section">
                        <h3>Afternoon</h3>
                        <textarea
                            value={afternoon}
                            onChange={(e) => setAfternoon(e.target.value)}
                            placeholder="How did your day afternoon?"
                        />
                    </div>

                    <div className="editor-section">
                        <h3>Evening</h3>
                        <textarea
                            value={evening}
                            onChange={(e) => setEvening(e.target.value)}
                            placeholder="How did your evening?"
                        />
                    </div>
                </div>

                <div className="editor-footer">
                    <button
                        className={`btn-primary ${status === 'Saved' ? 'btn-success' : ''}`}
                        onClick={handleSaveAll}
                        disabled={status === 'Saving...'}
                    >
                        {status === 'Saving...' ? 'Saving...' : status === 'Saved' ? 'Saved!' : 'Save Entry'}
                    </button>
                </div>
            </div>
            <StarIcon />
        </div>
    );
}

