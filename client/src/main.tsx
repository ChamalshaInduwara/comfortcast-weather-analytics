import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App";
import "./index.css";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

if (!domain || !clientId || !audience) {
  throw new Error(
    "Required Auth0 environment variables are missing.",
  );
}

createRoot(
  document.getElementById("root")!,
).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
);