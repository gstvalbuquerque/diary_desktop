import { useState } from 'react';
import './App.css';
import LoginScreen from './Login';
import Dashboard from './Dashboard';
import EntryEditor from './EntryEditor';

function App() {
    const [view, setView] = useState('login'); // login, dashboard, editor
    const [selectedDate, setSelectedDate] = useState('');

    const handleLogin = () => {
        setView('dashboard');
    };

    const handleEditEntry = (date) => {
        setSelectedDate(date);
        setView('editor');
    };

    const handleBack = () => {
        setView('dashboard');
        setSelectedDate('');
    };

    const handleLogout = () => {
        setView('login');
    };

    return (
        <div id="App">
            {view === 'login' && <LoginScreen onLogin={handleLogin} />}
            {view === 'dashboard' && <Dashboard onEditEntry={handleEditEntry} onLogout={handleLogout} />}
            {view === 'editor' && <EntryEditor date={selectedDate} onBack={handleBack} />}
        </div>
    );
}

export default App;
