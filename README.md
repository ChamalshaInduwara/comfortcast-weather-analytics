# ComfortCast

ComfortCast is a full-stack weather analytics application for comparing live weather conditions across ten cities. It retrieves data from OpenWeatherMap, calculates a backend-owned Comfort Index, ranks the cities, and presents the results in a responsive Auth0-protected dashboard.

This project was built as a student-friendly implementation of the Fidenz Trainee Software Engineer technical assessment. The design favors understandable application code, a small service layer, and explicit trade-offs over unnecessary infrastructure.

## Features

- Live OpenWeatherMap weather data for ten configured cities
- A three-parameter Comfort Index using temperature, humidity, and wind speed
- Auth0 login and protected API routes with JWT validation
- Five-minute raw weather caching with HIT/MISS diagnostics
- Separate five-minute processed analytics caching
- Independent 24-hour temperature trend graph with eight forecast points
- City search/filter and sorting by rank, temperature, or name
- Persistent light/dark mode
- Vitest unit tests for the Comfort Index
- Lazy-loaded forecast graph to keep the initial dashboard bundle smaller

## Tech Stack

- Frontend: React, TypeScript, Vite, CSS, Auth0 React SDK, Recharts
- Backend: Node.js, Express, TypeScript, Axios, Auth0 JWT middleware
- External services: OpenWeatherMap and Auth0
- Testing: Vitest

## Project Structure

```text
comfortcast-weather-analytics/
|- client/
|  |- src/
|  |  |- components/
|  |  |- pages/
|  |  |- services/
|  |  |- hooks/
|  |  |- types/
|  |  |- App.tsx
|  |  |- App.css
|  |  |- main.tsx
|  |  `- index.css
|  `- package.json
|- server/
|  |- src/
|  |  |- data/cities.json
|  |  |- services/
|  |  |  |- cache.service.ts
|  |  |  |- city.service.ts
|  |  |  |- comfort.service.ts
|  |  |  |- comfort.service.test.ts
|  |  |  |- forecast.service.ts
|  |  |  `- weather.service.ts
|  |  |- types/
|  |  `- server.ts
|  `- package.json
|- .gitignore
`- README.md
```

## Comfort Index

The current assessment baseline uses exactly three inputs: temperature, humidity, and wind speed. Ideal conditions are 22 C, 50% humidity, and 2 m/s wind.

```text
Temperature Score = clamp(100 - abs(temperature - 22) * 6, 0, 100)
Humidity Score = clamp(100 - abs(humidity - 50) * 2, 0, 100)
Wind Score = clamp(100 - abs(windSpeed - 2) * 15, 0, 100)

Comfort Index =
  Temperature Score * 0.50
  + Humidity Score * 0.30
  + Wind Score * 0.20
```

Temperature has the largest weight because it most directly affects perceived comfort. Humidity and wind modify that experience and therefore have lower weights. The final value is clamped to 0-100 and rounded to a whole number. Cities are sorted by this backend score in descending order and assigned ranks starting at 1.

The formula intentionally remains ready for the live recording change required by the assessment. No fourth scoring parameter is implemented in the current version.

## Getting Started

### Requirements

- Node.js 18 or later
- npm
- An Auth0 application and API
- An OpenWeatherMap API key

### Install

```bash
git clone https://github.com/your-username/comfortcast-weather-analytics.git
cd comfortcast-weather-analytics
cd client && npm install
cd ../server && npm install
```

### Configure environment

Create `client/.env` locally with the frontend configuration below. Do not
commit this file:

```env
VITE_API_URL=http://localhost:5000
VITE_AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
VITE_AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
VITE_AUTH0_AUDIENCE=https://comfortcast-api
```

Create `server/.env` locally with the backend configuration below. Do not
commit this file:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
AUTH0_AUDIENCE=https://comfortcast-api
```

Keep the Auth0 domain without `https://`.

### OpenWeatherMap setup

Create an OpenWeatherMap account and add the API key to `server/.env` as
`OPENWEATHER_API_KEY`. The backend sends each numeric `CityCode` from
`server/src/data/cities.json` to the current-weather and forecast endpoints with
metric units.

### Auth0 setup

Create an Auth0 Single Page Application and an API whose audience matches
`AUTH0_AUDIENCE`. Configure the client callback, logout, and allowed web origins
for the Vite development URL. The backend validates JWT bearer tokens using the
configured domain and audience.

Public signup restriction and MFA are Auth0 tenant settings, not claims made by
the source code. Before submission, verify that public signup is disabled, the
reviewer account is authorized, email is verified, and the required MFA/email
verification policy is enabled in the Auth0 dashboard.

### Run

Start the backend in one terminal:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

## API Endpoints

| Method | Endpoint                     | Authentication | Purpose                            |
| ------ | ---------------------------- | -------------- | ---------------------------------- |
| GET    | `/api/health`                | Public         | Server health check                |
| GET    | `/api/weather/analytics`     | Auth0 JWT      | Ranked current weather analytics   |
| GET    | `/api/weather/trend/:cityId` | Auth0 JWT      | Eight forecast points for one city |
| GET    | `/api/cache/status`          | Auth0 JWT      | Raw weather cache diagnostics      |

The frontend sends `Authorization: Bearer <token>`. Invalid city IDs return `400`, missing or invalid tokens return `401`, unknown paths return `404`, and upstream forecast failures remain isolated to the graph area.

The health endpoint is intentionally public. Weather analytics, cache status,
and forecast routes require a valid Auth0 access token.

## Caching Design and Trade-offs

Raw current-weather responses are cached by city ID for exactly five minutes. The cache records hits and misses and is inspected through `/api/cache/status`. The ranked analytics response is cached separately for five minutes to avoid repeating processing. Forecast responses use their own five-minute in-memory cache and are transformed into the first eight three-hour points.

All caches are process-local and disappear when the backend restarts. This keeps the assessment implementation simple and means changing the Comfort Index followed by a restart immediately recomputes rankings. A distributed cache would be more suitable for multiple backend instances or production deployments.

The raw current-weather cache is the mandatory cache and is keyed by city ID.
The processed analytics and forecast caches are separate so they do not mix raw
OpenWeather responses with application-specific output.

## Testing and Builds

```bash
cd server
npm test
npx tsc --noEmit

cd ../client
npm run lint
npx tsc --noEmit
npm run build
```

The tests cover ideal and uncomfortable conditions, score bounds, whole-number output, and independent temperature, humidity, and wind effects.

## Security, Responsive Design, and Limitations

- Auth0 validates JWTs on every weather and cache endpoint.
- The dashboard is only rendered for authenticated users, and Auth0 local storage caching supports refresh persistence.
- CORS is restricted to `CLIENT_ORIGIN`; API keys and secrets remain in ignored `.env` files.
- The dashboard, controls, cards, login flow, and graph adapt to desktop, tablet, and mobile layouts.
- City configuration is parsed once at startup and requires at least ten unique positive numeric CityCode values.
- Results depend on OpenWeatherMap availability, quota, and valid credentials.
- In-memory caches are not shared across processes.
- The forecast graph depends on OpenWeatherMap availability and valid Auth0
  credentials, so its complete end-to-end behavior requires manual testing with
  configured services.

## Assessment checklist

Before submitting, manually verify:

- Login, logout, refresh persistence, and MFA work in Auth0.
- All ten cities load and show backend-calculated scores and ranks.
- Search, sorting, dark mode, and the forecast city selector work on mobile.
- The graph displays real forecast data for multiple cities.
- An unauthenticated API request receives `401`.
- The repository contains no real API keys, passwords, tokens, or committed
  `.env` files.

The current recording baseline intentionally uses only temperature, humidity,
and wind speed. Any additional Comfort Index parameter must be added live
during the required assessment recording, not before it.
