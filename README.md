# ComfortCast

ComfortCast is a full-stack weather analytics application designed to compare city conditions using a custom Comfort Index. The project combines secure authentication, external API integration, backend business logic, caching, and responsive frontend design into a single, complete full-stack solution.

This project was developed as a trainee software engineering assessment and demonstrates practical experience in building a secure, user-friendly application with modern web technologies.

---

## Project Overview

The application retrieves live weather data from OpenWeatherMap, evaluates each city using a custom comfort model, and ranks locations from the most comfortable to the least comfortable. The results are displayed in a dashboard that is designed for desktop, tablet, and mobile viewing.

The backend is responsible for:

- validating Auth0 access tokens
- fetching and transforming weather data
- calculating the Comfort Index
- sorting cities by comfort score
- caching weather responses to reduce repeated API requests

The frontend is responsible for:

- rendering the dashboard interface
- displaying weather data and rankings
- handling login/logout with Auth0
- providing a responsive experience across screen sizes

---

## Key Features

- Live weather data retrieval from OpenWeatherMap
- Custom Comfort Index scaled from 0 to 100
- Ranking of cities by comfort score
- Display of temperature, humidity, wind speed, pressure, and weather description
- Secure authentication using Auth0
- Protected backend endpoints with JWT validation
- Server-side caching for weather responses
- Cache hit and miss tracking
- Responsive dashboard layout for desktop and mobile devices
- Unit testing for comfort logic using Vitest

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- Auth0 React SDK

### Backend

- Node.js
- Express.js
- TypeScript
- Axios
- Auth0 JWT validation middleware

### Testing

- Vitest

### External Services

- OpenWeatherMap API
- Auth0

---

## Project Structure

```text
comfortcast-weather-analytics/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
├── server/
│   ├── src/
│   │   ├── data/
│   │   │   └── cities.json
│   │   ├── services/
│   │   │   ├── cache.service.ts
│   │   │   ├── city.service.ts
│   │   │   ├── comfort.service.ts
│   │   │   ├── comfort.service.test.ts
│   │   │   └── weather.service.ts
│   │   ├── types/
│   │   └── server.ts
│   └── package.json
├── .gitignore
├── README.md
└── package.json
```

---

## Application Workflow

```text
User
  ↓
Auth0 Login
  ↓
JWT Token Validation
  ↓
React Dashboard
  ↓
Protected Backend API
  ↓
Cache Check
  ↓
OpenWeatherMap API
  ↓
Comfort Calculation
  ↓
City Ranking
  ↓
Dashboard Display
```

The comfort score and ranking are calculated on the backend so the frontend can render a clean, consistent dataset without duplicating business logic.

---

## Comfort Index Model

The Comfort Index is a custom scoring model used to estimate how comfortable a city’s weather conditions are. The score ranges from:

```text
0 - 100
```

A higher value indicates more comfortable conditions.

The model uses three weather factors:

1. Temperature
2. Humidity
3. Wind speed

### Temperature Score

A comfortable reference temperature is set at 22°C.

```text
Temperature Score = 100 - |Temperature - 22| × 6
```

### Humidity Score

A comfortable reference humidity level is set at 50%.

```text
Humidity Score = 100 - |Humidity - 50| × 2
```

### Wind Score

A comfortable reference wind speed is set at 2 m/s.

```text
Wind Score = 100 - |Wind Speed - 2| × 15
```

### Final Formula

```text
Comfort Index =
(Temperature Score × 0.50)
+ (Humidity Score × 0.30)
+ (Wind Score × 0.20)
```

| Factor      | Weight |
| ----------- | -----: |
| Temperature |    50% |
| Humidity    |    30% |
| Wind Speed  |    20% |

The final result is clamped to the range 0–100 and rounded to the nearest whole number.

---

## Design Rationale

The weighting reflects the relative importance of each weather condition in perceived comfort:

- Temperature has the highest weight because it most directly affects how comfortable the environment feels.
- Humidity is important because it influences how hot or unpleasant conditions feel.
- Wind speed affects comfort but has a slightly smaller influence in this model.

This is a lightweight heuristic designed for the project and is intended as a practical weather-analysis model rather than a formal scientific measurement.

---

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm
- Auth0 account
- OpenWeatherMap API key

### 1. Clone the repository

```bash
git clone https://github.com/your-username/comfortcast-weather-analytics.git
cd comfortcast-weather-analytics
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create the required `.env` files in the client and server directories.

#### Client environment variables

```env
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-api-audience
VITE_API_URL=http://localhost:5000
```

#### Server environment variables

```env
AUTH0_DOMAIN=your-auth0-domain
AUTH0_AUDIENCE=your-auth0-api-audience
OPENWEATHER_API_KEY=your-openweather-api-key
PORT=5000
```

> The frontend sends the Auth0 access token in the Authorization header, and the server validates it before allowing access to protected endpoints.

### 5. Run the application

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

The application should then be available in the browser through the client development server.

---

## Available API Endpoints

### Public endpoint

```http
GET /api/health
```

Returns the current server status.

### Protected endpoints

```http
GET /api/weather/analytics
GET /api/cache/status
```

These routes require a valid Auth0 JWT token in the request header:

```http
Authorization: Bearer <access_token>
```

---

## Weather Data

Weather data is retrieved using the OpenWeatherMap API. City IDs are stored in:

```text
server/src/data/cities.json
```

The current implementation analyzes a set of 10 cities and reads values such as:

- temperature
- humidity
- wind speed
- pressure
- cloudiness
- visibility
- weather description

The Comfort Index currently uses temperature, humidity, and wind speed only.

---

## Server-Side Caching

To reduce unnecessary OpenWeatherMap requests, raw weather responses are cached on the server for 5 minutes (300 seconds).

The cache uses the city ID as the key and stores the response along with an expiry timestamp.

### Cache flow

```text
Request
  ↓
Cache Check
  ↓
If hit -> use cached data
If miss -> fetch from OpenWeatherMap
  ↓
Store response in cache
  ↓
Calculate Comfort Score
  ↓
Return result
```

### Cache status endpoint

```http
GET /api/cache/status
```

This route returns information such as:

- cache size
- total hits
- total misses
- TTL
- cached city IDs
- expiry status for each entry

---

## Authentication and Security

Authentication is implemented using Auth0 and includes:

- secure login flow
- logout support
- JWT access token validation
- protected backend endpoints
- multi-factor authentication support
- email MFA for verified users
- public signup disabled

The frontend receives a token after authentication and sends it to the API for protected access.

---

## Testing

The backend includes unit tests for the comfort index logic using Vitest.

Run tests with:

```bash
cd server
npm test
```

---

## Student Reflection

This project helped build practical understanding in several essential software engineering areas, including:

- full-stack application architecture
- secure user authentication and authorization
- external API integration
- backend data processing and business logic
- caching strategies
- responsive front-end design
- testing and validation
- environment configuration and deployment readiness

Overall, this project demonstrates a balanced approach to delivering a working application that is both functional and user-friendly.

---

## License

This project is intended for educational and assessment purposes.

This adds another security step after normal email and password authentication.

---

# API Endpoints

## Health Check

```http
GET /api/health
```

Authentication:

```text
Not required
```

Example response:

```json
{
  "status": "ok",
  "message": "Fidenz Weather Analytics API is running"
}
```

---

## Weather Analytics

```http
GET /api/weather/analytics
```

Authentication:

```text
Required
```

This endpoint:

1. Reads the configured city IDs
2. Retrieves live or cached weather data
3. Calculates Comfort Scores
4. Sorts the cities
5. Assigns ranks
6. Returns the results

---

## Cache Status

```http
GET /api/cache/status
```

Authentication:

```text
Required
```

This endpoint returns information about the current server-side cache.

---

# Environment Variables

Environment variables are used to keep configuration values and API keys outside the source code.

Real `.env` files are ignored by Git.

---

## Backend

Create:

```text
server/.env
```

Example:

```env
PORT=5000

OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY

AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
AUTH0_AUDIENCE=https://comfortcast-api
```

The Auth0 domain should be entered without `https://`.

Example:

```text
your-tenant.au.auth0.com
```

---

## Frontend

Create:

```text
client/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000

VITE_AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
VITE_AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
VITE_AUTH0_AUDIENCE=https://comfortcast-api
```

---

# Local Setup

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

You will also need:

- OpenWeatherMap API key
- Auth0 account

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd comfortcast-weather-analytics
```

---

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

Create:

```text
server/.env
```

and add the required environment variables.

Start the backend:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

---

## 3. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

Create:

```text
client/.env
```

and add the required environment variables.

Start the frontend:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

---

# Testing

The Comfort Index has unit tests written using **Vitest**.

Run:

```bash
cd server
npm test
```

The current tests check that:

- Ideal weather produces the expected maximum score
- Less comfortable weather decreases the score
- Scores cannot exceed `100`
- Scores cannot go below `0`
- The final score is returned as a whole number

---

# TypeScript Check

To check the backend TypeScript code:

```bash
cd server
npx tsc --noEmit
```

If there are no errors, the command completes successfully.

---

# Frontend Production Build

To verify the frontend production build:

```bash
cd client
npm run build
```

---

# Responsive Design

The application was designed to work on:

- Desktop
- Laptop
- Tablet
- Mobile

The interface has been tested at different screen sizes such as:

```text
1440px
1024px
768px
430px
390px
375px
320px
```

On larger screens, weather cards are displayed in two columns.

On tablets and mobile devices, the layout changes to a single-column view.

The login page also uses a simplified layout on smaller screens.

---

# Main Design Decisions

## Backend Comfort Calculation

I calculated the Comfort Index on the backend because I wanted the main business logic to stay in one place.

This also means the frontend does not need to know how the score is calculated.

---

## Concurrent Weather Requests

I used:

```ts
Promise.all(...)
```

to retrieve weather information for multiple cities concurrently.

This reduces the time required compared with requesting each city one after another.

---

## Auth0

I used Auth0 instead of building authentication manually.

It provides features such as:

- Secure authentication
- JWT access tokens
- Universal Login
- MFA
- Email verification
- Session management

---

## In-Memory Cache

For this assessment, I used an in-memory `Map` for caching.

I chose this because it is simple, fast, and does not require additional infrastructure.

---

# Trade-offs

### In-Memory Cache

The current caching solution is suitable for a small application and this technical assessment.

However:

- The cache is lost when the backend restarts
- Multiple backend instances would not share the same cache

For a production system with multiple servers, I would consider using **Redis**.

### Comfort Index

The current formula is simple and easy to explain and test.

However, real weather comfort can depend on many additional factors and can also be different from person to person.

---

# Known Limitations

- The Comfort Index is a custom heuristic
- Weather comfort is subjective
- The current formula uses only three parameters
- Weather accuracy depends on OpenWeatherMap
- Cache data is removed when the backend restarts
- The cache is not shared between multiple backend servers
- Historical weather information is not stored
- The application currently focuses only on current weather conditions

---

# Possible Future Improvements

If I continued developing this project, I would consider adding:

- Additional Comfort Index parameters
- Dark mode
- Frontend sorting and filtering
- Weather graphs
- Historical weather data
- Redis caching
- More backend integration tests
- Frontend component tests
- Improved accessibility
- Production monitoring and logging

---

# Security Considerations

- API keys are stored in environment variables
- `.env` files are excluded from Git
- The Auth0 Client Secret is not stored in frontend code
- Protected API routes require valid JWT access tokens
- Public user signup is disabled
- MFA is enabled
- Unauthorized API requests return `401`

---

# Author

Developed as part of the **Fidenz Trainee Software Engineer Technical Assessment**.
