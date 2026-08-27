import { useAuth0 } from "@auth0/auth0-react";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const {
    isAuthenticated,
    isLoading,
    error,
  } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-message">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-message error-message">
        <div>
          <h2>Authentication error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <DashboardPage />;
}

export default App;