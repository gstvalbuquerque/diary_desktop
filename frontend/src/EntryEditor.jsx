import { useState, useEffect } from 'react';
import { GetEntry, SaveEntry, DeleteEntry } from "../wailsjs/go/main/App";

export default function EntryEditor({ date, onBack }) {
    const [morning, setMorning] = useState('');
    const [afternoon, setAfternoon] = useState('');
    const [evening, setEvening] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        loadEntry();
    }, [date]);

    const loadEntry = async () => {
        const [entry, exists] = await GetEntry(date);
        if (exists) {
            setMorning(entry.morning || '');
            setAfternoon(entry.afternoon || '');
            setEvening(entry.evening || '');
        }
    };

    const handleSave = async (section, content) => {
        setStatus('Saving...');
        try {
            await SaveEntry(date, section, content);
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

    return (
        <div className="editor-container">
            <header className="editor-header">
                <button className="btn-text" onClick={onBack}>&larr; Back</button>
                <h2>Entry for {date}</h2>
                <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </header>

            <div className="editor-grid">
                <div className="editor-section">
                    <h3>Morning</h3>
                    <textarea
                        value={morning}
                        onChange={(e) => setMorning(e.target.value)}
                        onBlur={() => handleSave('morning', morning)}
                        placeholder="How did your day start?"
                    />
                </div>

                <div className="editor-section">
                    <h3>Afternoon</h3>
                    <textarea
                        value={afternoon}
                        onChange={(e) => setAfternoon(e.target.value)}
                        onBlur={() => handleSave('afternoon', afternoon)}
                        placeholder="What happened during the day?"
                    />
                </div>

                <div className="editor-section">
                    <h3>Evening</h3>
                    <textarea
                        value={evening}
                        onChange={(e) => setEvening(e.target.value)}
                        onBlur={() => handleSave('evening', evening)}
                        placeholder="How did the day end?"
                    />
                </div>
            </div>

            {status && <div className="save-status">{status}</div>}
        </div>
    );
}
