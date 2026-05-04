<h1 align="center">Yell Records Store</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/RxJS-B7178C?logo=reactivex&logoColor=white" />
  <img src="https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white" />
</p>

<p align="center">
    The front-end dashboard for the Yell Records store.
</p>

<p align="center">
    <img src="https://img.shields.io/badge/status-in_development-blue" />
</p>

## Project Overview

This repository is public for CI/CD purposes only. All rights reserved. No permission is granted to use, copy, modify, or
distribute this code.

## Tech Stack

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.0.

<img src="https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=white" /> <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white" />

Code is formatted using Prettier, and linted against ESLint. Pull requests will be checked automatically to ensure the changes fulfill these requirements.

**RxJS** is used for making HTTP calls to the backend services. Components handle the state of observables which get returned.

## Getting Started

To run the project locally, you can either use one of the [release builds](https://github.com/Yell-Records/yell-store-web/releases) or serve the application from the repository itself.

### Prerequisites

1. Download and run the [backend service](https://github.com/Yell-Records/yell-store-services) before starting the application.
2. Install [Node.js](https://nodejs.org/en).

### Release builds

1. [Download](https://github.com/Yell-Records/yell-store-web/releases) the latest release .zip file and unzip the contents somewhere.
2. From the extracted folder, run `npx serve -l 4200`.
3. Visit http://localhost:4200 to view the application.

### Source builds

**Note** - Running the project through the source code is mostly intended for developers and not if you just want to see the application.

1. Clone the repository:
   ```
   https://github.com/Yell-Records/yell-store-web.git
   ```
2. Install dependencies with `npm install`.
3. Run the web server with `npm start`.
4. Visit http://localhost:4200 to view the application.
