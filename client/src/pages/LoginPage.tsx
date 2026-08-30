import { useAuth0 } from "@auth0/auth0-react";

import { useTheme } from "../hooks/useTheme";

function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogin = async () => {
    await loginWithRedirect();
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        {/* Left branding panel */}
        <div className="auth-visual">
          <div className="auth-brand">
            <div className="auth-logo">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 15.5A4.5 4.5 0 0 1 7.5 11h.4A6 6 0 0 1 19.5 13a3.5 3.5 0 0 1-.5 7H7a4 4 0 0 1-4-4v-.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3v3M5.7 5.7l2.1 2.1M18.3 5.7l-2.1 2.1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <span>ComfortCast</span>
          </div>

          <div className="auth-visual-content">
            <span className="auth-pill">Live Weather Analytics</span>

            <h1>
              Understand weather.
              <span> Discover comfort.</span>
            </h1>

            <p>
              Compare real-time weather conditions across cities using a custom
              Comfort Index built from temperature, humidity and wind
              conditions.
            </p>

            <div className="auth-feature-grid">
              <div className="auth-feature">
                <strong>10+</strong>
                <span>Cities analysed</span>
              </div>

              <div className="auth-feature">
                <strong>0–100</strong>
                <span>Comfort scoring</span>
              </div>

              <div className="auth-feature">
                <strong>Live</strong>
                <span>Weather data</span>
              </div>
            </div>
          </div>

          <div className="auth-visual-footer">
            <span className="status-dot" />
            OpenWeather data • Secure Auth0 access
          </div>
        </div>

        {/* Right login panel */}
        <div className="auth-login">
          <div className="auth-login-inner">
            <button
              type="button"
              className="auth-theme-button"
              onClick={toggleTheme}
              aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
              aria-pressed={darkMode}
            >
              {darkMode ? "☀ Light" : "☾ Dark"}
            </button>

            <div className="auth-mobile-brand">
              <div className="auth-logo small">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M3 15.5A4.5 4.5 0 0 1 7.5 11h.4A6 6 0 0 1 19.5 13a3.5 3.5 0 0 1-.5 7H7a4 4 0 0 1-4-4v-.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span>ComfortCast</span>
            </div>

            <p className="auth-eyebrow">Welcome back</p>

            <h2>Sign in to your dashboard</h2>

            <p className="auth-description">
              Access ranked weather analytics and discover which cities
              currently offer the most comfortable conditions.
            </p>

            <button
              type="button"
              className="auth-login-button"
              onClick={handleLogin}
              disabled={isLoading}
            >
              <span>
                {isLoading ? "Redirecting..." : "Continue to secure login"}
              </span>

              {!isLoading && (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <div className="auth-security">
              <div className="auth-security-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 3 5 6v5c0 4.5 2.7 8 7 10 4.3-2 7-5.5 7-10V6l-7-3Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="m9.5 12 1.7 1.7 3.5-3.7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <strong>Secure authentication</strong>
                <p>Protected with Auth0 and multi-factor authentication.</p>
              </div>
            </div>

            <p className="auth-note">
              Access is restricted to authorized users only.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
