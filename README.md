# ComfortCast – Weather Comfort Analytics

ComfortCast is a secure full-stack weather analytics application developed for the Fidenz Trainee Software Engineer assignment.

The application retrieves current weather information from OpenWeatherMap, calculates a custom Comfort Index for each city, ranks cities from most comfortable to least comfortable, and displays the results through a responsive React dashboard.

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
- Auth0 JWT validation
- Vitest

### External Services
- OpenWeatherMap API
- Auth0

---

## Features

- Reads city codes from `cities.json`
- Processes 10 cities
- Retrieves live weather data from OpenWeatherMap
- Calculates a custom Comfort Index on the backend
- Produces a score between 0 and 100
- Ranks cities from most comfortable to least comfortable
- Displays:
  - City name
  - Weather description
  - Temperature
  - Humidity
  - Wind speed
  - Pressure
  - Comfort Score
  - Rank
- Responsive desktop and mobile interface
- 5-minute server-side weather caching
- Cache HIT/MISS debugging endpoint
- Auth0 authentication
- Protected backend API using JWT access tokens
- Login and logout
- Public signup disabled
- Multi-Factor Authentication
- Email MFA support
- Comfort Index unit tests

---

# Project Structure

```text
comfortcast-weather-analytics/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── data/
│   │   │   └── cities.json
│   │   ├── services/
│   │   ├── types/
│   │   └── server.ts
│   └── package.json
│
└── README.md