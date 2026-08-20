# Finalyze

**Finalyze** is a mobile personal finance management app that combines data-driven insights with gamification to help users track expenses, set savings goals and build lasting financial habits.

> "To become the world's most engaging and trusted personal finance platform, where every individual feels empowered to master their money and reach life-changing financial milestones."

Developed by **LGP 26** at the Faculdade de Engenharia da Universidade do Porto (FEUP), as part of the *Laboratório de Gestão de Projetos* course.

---

## Table of Contents
- [About Finalyze](#about-finalyze)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [How to Contribute](#how-to-contribute)
- [How to Run](#how-to-run)
  - [Prerequisites](#prerequisites)
  - [1. Run the Backend](#1-run-the-backend)
  - [2. Run the Frontend](#2-run-the-frontend)
- [PgAdmin — How to Access](#pgadmin--how-to-access)
- [Team](#team)

---

## About Finalyze

Finalyze is a fintech app designed for people managing their finances toward a major milestone for the first time — buying a house, building an emergency fund, or simply becoming a better saver. Unlike apps that only track spending, Finalyze adds gamification, goal setting and peer benchmarking (anonymized comparisons with similar user profiles) to make money management more engaging and motivating.

**Mission:** Provide data-driven guidance, interactive challenges and peer-based benchmarking to help users confidently manage expenses, set meaningful goals and build lasting savings habits.

**Core Values:** Innovation · Empowerment · Transparency · Simplicity · Accountability & Integrity · Engagement & Achievement · Security & Trust

**Target Users:** Students, young professionals and early-career individuals who are digitally native but lack traditional financial guidance.

**Business Model:** Freemium (B2C) with premium subscriptions for advanced features (personalized reports, detailed benchmarking), complemented by GDPR-compliant B2B data partnerships with fintechs and financial institutions.

## Key Features

- 📊 **Expense & income tracking**
- 🎯 **Savings goal setting and tracking**
- 🏆 **Gamification** — challenges, progress tracking and achievement badges
- 📈 **Benchmarking engine** — anonymized comparisons against similar user profiles
- 🔒 **Secure authentication & data encryption**, built for GDPR compliance

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile Frontend | React Native (Expo) |
| Backend | Spring Boot (Java) |
| Database | PostgreSQL |
| DevOps | Docker / Docker Compose |
| DB Admin | PgAdmin |

This stack was chosen to keep the app scalable and cost-efficient while allowing the team to iterate quickly across both mobile and backend development.

---

## How to Contribute

When implementing a new feature, please follow these steps:

1. Create a new branch from `develop` named after the feature you are going to implement.
2. Implement the feature.
3. Push the branch to the remote repository.
4. Open a pull request targeting the `develop` branch.
5. Wait for the pull request to be reviewed and merged.

## How to Run

### Prerequisites

- Java >= 17
- [Node.js / NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) >= 10.0
- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Android Studio](https://developer.android.com/studio) (for running the app in an emulator)
- [VSCode](https://code.visualstudio.com/) (optional, but recommended)

We recommend using **VSCode** as your IDE, so you can write code for both the frontend and backend in the same place. Android Studio is used only to run the emulator — if you prefer another IDE for the backend (e.g. IntelliJ), that's fine too, but this README doesn't cover that setup.

Clone the repository:

```bash
git clone git@github.com:FEUP-LGP-2025/LGP-26.git
```

From the root folder of the project, spin up the database and PgAdmin:

```bash
docker-compose build
docker-compose up
```

### 1. Run the Backend

From the root folder, navigate to the `backend` folder and run:

```bash
./gradlew bootRun
```

This starts the Spring Boot application on port `8080`. The API is available at [http://localhost:8080/api](http://localhost:8080/api).

For demonstration purposes, a `HelloController.java` is included, which returns `This endpoint is working!` at [http://localhost:8080/api/hello](http://localhost:8080/api/hello). You can test it via browser, Postman or curl.

### 2. Run the Frontend

To run the app in an emulator, install [Android Studio](https://developer.android.com/studio) and create an emulator.

Once the emulator is running, navigate to the `mobile` folder and install dependencies:

```bash
npm install
```

Then start the app:

```bash
npm run android
```

This launches the React Native app on the emulator.

**Note:** To let the frontend connect to the backend, create a `.env` file in the root of the `mobile` folder containing (while running an Android emulator):

```
EXPO_PUBLIC_API_URL="http://10.0.2.2:8080/api"
```

## PgAdmin — How to Access

While working with the database, you can inspect stored data via PgAdmin at [http://localhost:5050](http://localhost:5050).

Login credentials:

```
Email: admin@example.com
Password: admin_password
```

To connect to the database (make sure Docker is running):

1. Click **"Add New Server"** on the dashboard.
2. In the **General** tab, give the server any name you'd like.
3. In the **Connection** tab, fill in:
   - Host: `db`
   - Port: `5432`
   - Maintenance database: `mydb`
   - Username: `postgres`
   - Password: `postgres`
4. Click **Save**.

You should now be able to view the database tables and data.

---

## Team

**Laboratório de Gestão de Projetos — LGP 26**

- Beatriz Almeida (202108860)
- Catarina Ramos (202402981)
- Ema Martins (202402794)
- Francisca Carmo (up202402532)
- Henrique Pinheiro (202108879)
- Luís Jesus (202108683)
- Luís Tavares (202108662)
- Miguel Pedrosa (202108809)
- Pedro Plácido (up202107987)
- Rúben Esteves (202006479)

*Faculdade de Engenharia da Universidade do Porto (FEUP)*
