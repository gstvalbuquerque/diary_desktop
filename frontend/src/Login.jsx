import { useState } from 'react';
import { Login, Register } from "../wailsjs/go/main/App";

export default function LoginScreen({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            if (isRegistering) {
                await Register(username, password);
                // Auto login after register
                await Login(username, password);
            } else {
                await Login(username, password);
            }

            onLogin(username);
        } catch (err) {
            // Wails returns the error message string directly in the catch block
            setError(err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Daily Diary</h1>
                <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-primary">
                        {isRegistering ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                <p className="toggle-auth">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    <span onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? ' Login' : ' Register'}
                    </span>
                </p>
            </div>
        </div>
    );
}
