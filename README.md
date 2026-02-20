<p align="center">
  <h1 align="center">🌿 Greenhouse Monitoring & Control System</h1>
  <p align="center">
    A full-stack IoT web application for real-time greenhouse monitoring, remote device control, and automated scheduling — powered by Adafruit IO MQTT.
  </p>
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Architecture](#architecture)

---

## Overview

The Greenhouse Monitoring & Control System enables users to manage multiple greenhouses, monitor environmental sensor data (temperature, humidity, light, soil moisture) in real time, remotely control actuator devices, set up automated schedules, and receive threshold-based alerts — all from a responsive web dashboard.

---

## Features

| Feature | Description |
|---|---|
| **Authentication** | JWT-based sign up, sign in, and session management with protected routes |
| **Multi-Greenhouse Management** | Create, update, delete, and browse greenhouses with pagination |
| **Real-Time Monitoring** | Live sensor dashboard via Server-Sent Events (SSE) with charts |
| **Device Control** | Toggle controllers on/off, adjust slider values, send commands to IoT devices |
| **Threshold Alerts** | Automatic notifications when sensor readings exceed configured limits |
| **Scheduling** | Create recurring or one-time schedules for automated device operations |
| **Sensor History** | Paginated historical records filterable by date for each sensor type |
| **User Settings** | Manage profile, email, phone number, and password |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 6 | Build tool & dev server |
| Material UI (MUI) v6 | Component library & icons |
| React Router v7 | Client-side routing |
| Redux Toolkit | State management |
| Recharts | Data visualization & charts |
| Axios | HTTP client |
| EventSource Polyfill | SSE with auth headers |

### Backend

| Technology | Purpose |
|---|---|
| NestJS v11 | Server framework (TypeScript) |
| Prisma v6 | ORM & database client |
| MySQL | Relational database |
| MQTT (mqtt.js) | IoT messaging via Adafruit IO |
| JWT | Authentication tokens |
| Argon2 | Password hashing |
| RxJS | Reactive streams for SSE |

---

## Project Structure

```
├── Frontend/                # React (Vite) application
│   ├── src/
│   │   ├── apis/            # API service modules
│   │   ├── assets/          # Static assets
│   │   ├── components/      # Shared components (Header, SideBar)
│   │   ├── pages/           # Page components
│   │   │   ├── Auth/        # Login, Register, Verify
│   │   │   ├── Data/        # Sensor data dashboards
│   │   │   ├── Device/      # Device management
│   │   │   ├── GreenHouse/  # Greenhouse listing
│   │   │   ├── GreenHouseDetail/  # Greenhouse detail views
│   │   │   ├── History/     # Sensor history
│   │   │   ├── HomePage/    # Dashboard home
│   │   │   ├── Schedule/    # Schedule management
│   │   │   └── Setting/     # User settings
│   │   ├── redux/           # Redux store & slices
│   │   └── util/            # Utilities & constants
│   └── package.json
│
├── Backend/                 # NestJS application
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── devices/         # Device management module
│   │   ├── mqtt/            # MQTT integration module
│   │   ├── prisma/          # Prisma database module
│   │   ├── sse/             # Server-Sent Events module
│   │   └── user/            # User management module
│   ├── prisma/              # Prisma schema & migrations
│   ├── test/                # E2E tests
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **MySQL** database
- **Adafruit IO** account (for MQTT broker)

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend dev server will start at `http://localhost:5173`.

### Backend

```bash
cd Backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

The backend server will start at `http://localhost:8080`.

---

## Environment Variables

### Backend (`Backend/.env`)

```env
DATABASE_URL="mysql://user:password@localhost:3306/greenhouse"
PORT=8080
JWT_SECRET=your_jwt_secret

MQTT_PORT=8883
MQTT_USERNAME=your_adafruit_username
MQTT_PASSWORD=your_adafruit_api_key
```

### Frontend

Update the API base URL in `Frontend/src/util/constant.js` to match your backend address.

---

## API Reference

### Auth — `/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signin` | Sign in (returns JWT) |
| `POST` | `/auth/signup` | Register new user |
| `GET` | `/auth/profile` | Get current user profile |

### Greenhouse — `/greenhouse`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/greenhouse/details` | List greenhouses (paginated) |
| `GET` | `/greenhouse/names` | List greenhouse names |
| `POST` | `/greenhouse` | Create greenhouse |
| `PATCH` | `/greenhouse/:id` | Update greenhouse |
| `DELETE` | `/greenhouse/:id` | Delete greenhouse |

### Devices — `/devices`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/devices/controllers` | List controllers (paginated) |
| `GET` | `/devices/sensors` | List sensors (paginated) |
| `POST` | `/devices/controllers` | Add a controller |
| `POST` | `/devices/sensors` | Add a sensor |
| `POST` | `/devices/sendData` | Publish command via MQTT |
| `GET` | `/devices/sensor-records/:id` | Get sensor history |

### Scheduler — `/scheduler`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/scheduler/:greenhouseId` | List schedules |
| `POST` | `/scheduler` | Create schedule |
| `PATCH` | `/scheduler/:id` | Update schedule |
| `DELETE` | `/scheduler/:id` | Delete schedule |

### SSE — `/sse`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/sse` | Stream threshold alerts |
| `GET` | `/sse/data` | Stream live sensor data |
| `GET` | `/sse/notification` | Stream unread notifications |

---

## Architecture

```
┌─────────────┐     HTTP/SSE     ┌──────────────┐     MQTT      ┌──────────────┐
│   Frontend   │ ◄─────────────► │   Backend    │ ◄───────────► │ Adafruit IO  │
│   (React)    │                 │  (NestJS)    │               │  (MQTT Broker)│
└─────────────┘                  └──────┬───────┘               └──────┬───────┘
                                        │                              │
                                        │ Prisma ORM                   │ MQTT
                                        ▼                              ▼
                                 ┌──────────────┐              ┌──────────────┐
                                 │    MySQL     │              │  IoT Devices │
                                 │   Database   │              │  (Sensors &  │
                                 └──────────────┘              │ Controllers) │
                                                               └──────────────┘
```

**Data Flow:**
1. IoT sensors publish readings to Adafruit IO via MQTT
2. Backend subscribes to device topics, stores records in MySQL
3. If a reading exceeds the configured threshold, an alert is emitted
4. Frontend receives real-time updates via SSE streams
5. Users can send control commands from the dashboard → Backend → MQTT → Device

---

## License

This project is private and unlicensed.
