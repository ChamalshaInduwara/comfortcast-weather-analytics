import { useAuth0 } from "@auth0/auth0-react";

function LoginPage() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect();
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <p className="eyebrow">
          Weather Analytics
        </p>

        <h1>ComfortCast</h1>

        <p>
          Sign in to access the weather comfort
          analytics dashboard.
        </p>

        <button
          type="button"
          onClick={handleLogin}
        >
          Log In
        </button>
      </div>
    </main>
  );
}

export default LoginPage;