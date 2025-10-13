# PullBoard - Chingu Voyage 57, T33

<p align="center" />
<img width="800" alt="PullBoard hero" src="./client/public/PullBoard hero.png" />
 </p>

 <p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript Badge"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" alt="React Badge"/>
  <img src="https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white" alt="React router Badge"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite Badge"/>
  <img src="https://img.shields.io/badge/Babel-F9DC3E?logo=babel&logoColor=000" alt="Babel Badge"/>
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind Badge"/>
  <img src="https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff" alt="Npm Badge"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node-43853D?style=flat&logo=node.js&logoColor=white" alt="Node.js Badge"/>
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" alt="Express Badge"/>
  <img src="https://img.shields.io/badge/Firebase-039BE5?logo=Firebase&logoColor=white" alt="firebase Badege"/>
  <img src="https://img.shields.io/badge/Swagger-85EA2D?logo=insomnia&logoColor=000" alt="Swagger Badge"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white" alt="figma badge"/>
  <img src="https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=vsc&logoColor=white" alt="VSC Badge"/>
</p>


# Table of Contents

- [Description](#description)
- [Features](#️features)
- [Technologies Used](#technologies-used)
- [Configuration](#configuration)
- [Deployment Checklist](#deployment-checklist)
- [Special Thanks](#special-thanks)
- [Team Members](#team-members)

---
## Description
PullBoard is your team's mission control for GitHub pull requests.

Get a real-time overview of all open and closed PRs in one dashboard, identify bottlenecks, and track progress with clear, actionable insights. Never lose track of a review with smart filters and highlighted priorities.

Save time by streamlining your workflow, reducing context switching, and making your team's code review process more efficient and transparent.

## Features
- User authentication
- PRs Tracking
- JSON exporting
- Advanced filtering
- Control panel with statistical display of data

## Technologies Used



# Setup Workspace
1. Clone the repositiory
```bash
git clone https://github.com/chingu-voyages/V57-tier3-team-33.git
 ```
 2. installs dependencies from the root 
 ```bash
 npm install 
 ```




## Development Commands

From the **root folder**, you can run:

```bash
npm run dev:server   
npm run dev:client   
npm run dev          # Start both
```

## Configuration

### Environment Variables

Set up environment variables for both the server and client. Create the files and values below before running the app.

- Server env file: `server/.env`
- Client env files: `client/.env.development` (local dev), `client/.env.production` (production builds)

#### Server (`server/.env`)
- `PORT` 
- `TYPE` — Firebase service account `type` 
- `PROJECT_ID` — Firebase project ID
- `PRIVATE_KEY_ID` — Service account private key ID
- `PRIVATE_KEY` — Service account private key.
- `CLIENT_EMAIL` — Service account client email
- `CLIENT_ID` — Service account client ID
- `AUTH_URI` — OAuth auth URI 
- `TOKEN_URI` — OAuth token URI 
- `AUTH_PROVIDER_X509_CERT_URL` 
- `CLIENT_X509_CERT_URL` — Client X509 cert URL
- `UNIVERSE_DOMAIN` — Universe domain (e.g., `googleapis.com`)



#### Client (`client/.env.development` )
- `VITE_API_URL` — Base URL of your API (e.g., `http://localhost:4000`)
- `TEST_API_URL` — Optional fallback API URL used in `axios` setup
- `VITE_APIKEY` — Firebase Web API key
- `VITE_AUTHDOMAIN` — Firebase auth domain
- `VITE_PROJECTID` — Firebase project ID
- `VITE_STORAGEBUCKET` — Firebase storage bucket
- `VITE_MESSAGINGSENDERID` — Firebase messaging sender ID
- `VITE_APPID` — Firebase app ID





## Team Members
- Banto Klára : [GitHub](https://github.com/bantoklara) / [LinkedIn](https://www.linkedin.com/in/banto-laczi-klara/)
- Tibamwenda Anthony : [GitHub](https://github.com/AskTiba) / [LinkedIn](https://www.linkedin.com/in/tibamwenda-anthony-64144820b/)
- Henok Hailemariam : [GitHub](https://github.com/henokkhm) / [LinkedIn](https://www.linkedin.com/in/henokkhm)
- Yusuf Mohsen : [GitHub](https://github.com/yusufmohsiin) / [LinkedIn](https://www.linkedin.com/in/yusuf-mohsiin/)
- Mohamed Ouederni : [GitHub](https://github.com/9-barristanselmy-9) / [LinkedIn](https://www.linkedin.com/in/mohamed-ouederni-0bb11ab4) 
- Nazeeha Khalil Ahmed : [GitHub](https://github.com/nazeeha-kb) / [LinkedIn](https://www.linkedin.com/in/nazeeha-kb/) 

