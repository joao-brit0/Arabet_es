<p align="center">
  <a href="https://github.com/seu-usuario/arabet" target="_blank">
    <img src="docs/assets/banner.png" width="100%" alt="AraBet Banner" />
  </a>
</p>

<p align="center">
  A modern, integrated web platform built to simulate a sports betting system focused on Alagoas soccer.
</p>

<p align="center">
  <a href="#about"><img src="https://img.shields.io/badge/About-24292e?style=for-the-badge&logo=info&logoColor=white" alt="About" /></a>
  <a href="#demo"><img src="https://img.shields.io/badge/Demo-24292e?style=for-the-badge&logo=airplay&logoColor=white" alt="Demo" /></a>
  <a href="#built-with"><img src="https://img.shields.io/badge/Built%20With-24292e?style=for-the-badge&logo=react&logoColor=61DAFB" alt="Built With" /></a>
  <a href="#getting-started"><img src="https://img.shields.io/badge/Getting%20Started-24292e?style=for-the-badge&logo=laravel&logoColor=FF2D20" alt="Getting Started" /></a>
  <a href="#environment-variables--security"><img src="https://img.shields.io/badge/Security-24292e?style=for-the-badge&logo=springsecurity&logoColor=6DB33F" alt="Security" /></a>
  <a href="#contributing"><img src="https://img.shields.io/badge/Contributing-24292e?style=for-the-badge&logo=github&logoColor=white" alt="Contributing" /></a>
</p>
</br>
<p align="center">
  <img src="docs/assets/separator.svg" alt="separator" width="100%" />
</p>

<h2>About</h2>

AraBet is all about providing a realistic sports betting experience, allowing users to place simple bets, manage simulated wallets, and track their bet history. It features a robust PHP/Laravel backend REST API and a fast, responsive React frontend smoothly connected via Inertia.js.

<p align="center">
  <img src="docs/assets/separator.svg" alt="separator" width="100%" />
</p>

<h2>Demo</h2>

<p align="center">
  <img src="docs/assets/arabet-present.webp" width="100%" alt="AraBet Demo" />
</p>

<p align="center">
  <img src="docs/assets/separator.svg" alt="separator" width="100%" />
</p>

<h2>Built With</h2>

This project is built using the following major frameworks, libraries, and tools:

* [![React][React-shield]][React-url]
* [![Vite][Vite-shield]][Vite-url]
* [![Laravel][Laravel-shield]][Laravel-url]
* [![Inertia][Inertia-shield]][Inertia-url]
* [![Tailwind][Tailwind-shield]][Tailwind-url]
* [![PostgreSQL][Postgres-shield]][Postgres-url]
* [![Docker][Docker-shield]][Docker-url]

[React-shield]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[Vite-shield]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62B
[Vite-url]: https://vite.dev/
[Laravel-shield]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com/
[Inertia-shield]: https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white
[Inertia-url]: https://inertiajs.com/
[Tailwind-shield]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Postgres-shield]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/
[Docker-shield]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/

<p align="center">
  <img src="docs/assets/separator.svg" alt="separator" width="100%" />
</p>

<h2>Getting Started</h2>

The easiest way to run the entire stack (Frontend, Backend, Database, and migrations) is using Docker alongside Composer and NPM.

### Prerequisites
Make sure you have the following installed on your machine:
- Docker & Docker Compose
- Node.js & NPM
- PHP & Composer

### Execution Steps

1. **Clone the Repository:**
```bash
   $ git clone [https://github.com/seu-usuario/arabet.git](https://github.com/seu-usuario/arabet.git)
   $ cd arabet

   Setup Backend & Database:
Run the following command at the project root to fetch dependencies, configure the environment, and generate the app key:

Bash
   $ composer install
   $ cp .env.example .env
   $ php artisan key:generate
Note: Ensure your PostgreSQL connection details are correctly set in the .env file. Then, execute database migrations and seeders to populate initial game data:

Bash
   $ php artisan migrate --seed
Spin up the Frontend & Serve the App:
Install JavaScript dependencies and start the Vite and Laravel servers:

Bash
   $ npm install
   $ npm run dev
   $ php artisan serve
Accessing the Applications:
Once initialization completes, you can access the applications at:

Web Application & Backend: http://localhost:8000

The project's local development credentials and configs are predefined in the .env file.

During the backend build process, automated security actions must be executed:

The php artisan key:generate command is executed to dynamically create a unique 256-bit APP_KEY.

This key is bundled into the Laravel configuration to handle secure session encryption, password hashing, and cookie protection automatically.

Contributions must follow the guidelines set in the CONTRIBUTING.md file under the docs directory.

This project is licensed under the MIT License.