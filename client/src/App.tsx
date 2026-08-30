import { useAuth0 } from "@auth0/auth0-react";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  let page = <DashboardPage />;

  if (isLoading) {
    page = (
      <div className="page-message">
        <p>Checking authentication...</p>
      </div>
    );
  } else if (error) {
    page = (
      <div className="page-message error-message">
        <div>
          <h2>Authentication error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  } else if (!isAuthenticated) {
    page = <LoginPage />;
  }

  return <div className="app-shell">{page}</div>;
}

export default App;
