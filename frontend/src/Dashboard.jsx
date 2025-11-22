import { useState, useEffect } from 'react';
import { ListDates, Logout } from "../wailsjs/go/main/App";

const ProfileIcon = ({ onClick }) => (
    <svg
        className="profile-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
    </svg>
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

const NotebookIllustration = () => (
    <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background blobs/clouds */}
        <path d="M40 120C20 120 10 100 20 80C30 60 50 60 60 70C70 50 100 50 110 70C120 60 140 60 150 80C160 100 150 120 130 120H40Z" fill="#334155" opacity="0.5" />
        <ellipse cx="100" cy="130" rx="60" ry="10" fill="#1e293b" />

        {/* Book Pages */}
        <path d="M50 60 L95 50 L95 110 L50 120 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
        <path d="M105 50 L150 60 L150 120 L105 110 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />

        {/* Book Cover/Spine */}
        <path d="M95 50 L105 50 L105 110 L95 110 Z" fill="#94a3b8" />

        {/* Lines on pages */}
        <path d="M55 70 L90 62" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M55 80 L90 72" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M55 90 L90 82" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M55 100 L90 92" stroke="#cbd5e1" strokeWidth="2" />

        <path d="M110 62 L145 70" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M110 72 L145 80" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M110 82 L145 90" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M110 92 L145 100" stroke="#cbd5e1" strokeWidth="2" />

        {/* Pen */}
        <rect x="130" y="40" width="10" height="60" transform="rotate(30 130 40)" fill="#3b82f6" stroke="#1e293b" strokeWidth="1" />
        <path d="M125 92 L130 100 L135 97 Z" fill="#1e293b" />
    </svg>
);

export default function Dashboard({ onEditEntry, onLogout }) {
    const [dates, setDates] = useState([]);

    useEffect(() => {
        loadDates();
    }, []);

    const loadDates = async () => {
        const result = await ListDates();
        if (result) {
            result.sort((a, b) => {
                const [da, ma, ya] = a.split('-');
                const [db, mb, yb] = b.split('-');
                return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
            }).reverse();
            setDates(result);
        }
    };

    const handleLogout = async () => {
        await Logout();
        onLogout();
    };

    const getTodayDate = () => {
        const now = new Date();
        const d = String(now.getDate()).padStart(2, '0');
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const y = now.getFullYear();
        return `${d}-${m}-${y}`;
    };

    return (
        <>
            <header className="app-header">
                <h1 className="app-title">Daily Diary</h1>
                <ProfileIcon onClick={handleLogout} />
            </header>

            <div className="dashboard-container">
                {dates.length === 0 ? (
                    <div className="empty-state-card">
                        <h2 className="empty-state-title">Your Entries</h2>
                        <div className="illustration-container">
                            <NotebookIllustration />
                        </div>
                        <p className="empty-state-text">
                            Your journal is waiting.<br />
                            Record your day, ideas, or mood.
                        </p>
                        <button className="btn-primary" onClick={() => onEditEntry(getTodayDate())}>
                            + Write First Entry
                        </button>
                    </div>
                ) : (
                    <div className="entries-grid">
                        {/* If we have entries, show them (keeping existing grid logic but wrapped in new container) */}
                        {dates.map(date => (
                            <div key={date} className="entry-card" onClick={() => onEditEntry(date)}>
                                <div className="entry-date">
                                    <span className="day">{date.split('-')[0]}</span>
                                    <span className="month-year">{date.split('-')[1]}/{date.split('-')[2]}</span>
                                </div>
                                <div className="entry-preview">
                                    Click to view or edit
                                </div>
                            </div>
                        ))}
                        {/* Add a floating action button or similar for new entry if list is not empty?
                             The design only showed empty state. I'll add a simple "New Entry" card or button if list is not empty to ensure usability.
                         */}
                        <div className="entry-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)' }} onClick={() => onEditEntry(getTodayDate())}>
                            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>+ New Entry</span>
                        </div>
                    </div>
                )}

                <StarIcon />
            </div>
        </>
    );
}

