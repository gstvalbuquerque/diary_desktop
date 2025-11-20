import { useState, useEffect } from 'react';
import { ListDates, Logout } from "../wailsjs/go/main/App";

export default function Dashboard({ onEditEntry, onLogout }) {
    const [dates, setDates] = useState([]);

    useEffect(() => {
        loadDates();
    }, []);

    const loadDates = async () => {
        const result = await ListDates();
        // Sort dates descending (newest first)
        // Date format is DD-MM-YYYY, need to parse to sort correctly
        if (result) {
            result.sort((a, b) => {
                const [da, ma, ya] = a.split('-');
                const [db, mb, yb] = b.split('-');
                return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
            }).reverse(); // Actually we want descending
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
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Your Entries</h1>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={handleLogout}>Logout</button>
                    <button className="btn-primary" onClick={() => onEditEntry(getTodayDate())}>
                        + New Entry
                    </button>
                </div>
            </header>

            <div className="entries-grid">
                {dates.length === 0 ? (
                    <div className="empty-state">
                        <p>No entries yet. Start writing today!</p>
                    </div>
                ) : (
                    dates.map(date => (
                        <div key={date} className="entry-card" onClick={() => onEditEntry(date)}>
                            <div className="entry-date">
                                <span className="day">{date.split('-')[0]}</span>
                                <span className="month-year">{date.split('-')[1]}/{date.split('-')[2]}</span>
                            </div>
                            <div className="entry-preview">
                                Click to view or edit
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
