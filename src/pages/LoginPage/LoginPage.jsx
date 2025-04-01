import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './LoginPage.css';

// Import images from src/assets
import Logo from '../../assets/logo.png';
import GoogleIcon from '../../assets/google-icon.png';
import FacebookIcon from '../../assets/facebook-icon.png';
import AppleIcon from '../../assets/apple-icon.png';

function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      login(email, password);
      navigate('/workflows');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Section for branding */}
        <div className="left-section">
          <div className="brand-container">
            <div className="logo">
              <img src={Logo} alt="HighBridge" />
              <h1>HighBridge</h1>
            </div>
            <div className="tagline">
              <h2>Building the Future...</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section (the login card), absolutely positioned */}
        <div className="right-section">
          <div className="login-card">
            <div className="login-header">
              <h4>WELCOME BACK!</h4>
              <h2>Log In to your Account</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email"
                  id="email"
                  placeholder="test@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password"
                  id="password"
                  placeholder="123456"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input 
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
              </div>

              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="login-button">
                Log In
              </button>

              <div className="login-divider">
                <span>Or</span>
              </div>

              <div className="social-logins">
                <button type="button" className="social-login google">
                  <img src={GoogleIcon} alt="Google" />
                  <span>Log in with Google</span>
                </button>
                <button type="button" className="social-login facebook">
                  <img src={FacebookIcon} alt="Facebook" />
                  <span>Log in with Facebook</span>
                </button>
                <button type="button" className="social-login apple">
                  <img src={AppleIcon} alt="Apple" />
                  <span>Log in with Apple</span>
                </button>
              </div>

              <div className="signup-link">
                <span>New User? </span>
                <a href="/signup">SIGN UP HERE</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
