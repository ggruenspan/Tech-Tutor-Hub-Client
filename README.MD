# Tech Tutor Hub

## Overview

Tech Tutor Hub is an ongoing project with the goal of developing a web application that enables users to find a tutor tailored to their specific needs, employing a sleek and user-friendly interface. The primary technologies utilized in this project include Angular for the front end, Node.js for the back end, and Bootstrap for responsive design. User data is handled through Mongoose to ensure scalability, while robust security measures are implemented for user authentication and the sign-up/sign-in/sign-out processes. The application is designed to be mobile-friendly and accessible.

## Technologies Used
- **Front End:**
  - [AngularJS] - A powerful front-end framework for building dynamic web applications.
  - [Bootstrap] - A popular CSS framework for creating responsive and mobile-first designs.

- **Back End:**
  - [Node.js] - A JavaScript runtime built on Chrome's V8 JavaScript engine, providing an efficient and scalable server environment.
  - [Express] - A fast, unopinionated, minimalist web framework for Node.js.
  - [Body-Parser] - Node.js body parsing middleware.
  - [Cors] - Express middleware to enable CORS (Cross-Origin Resource Sharing).
  - [Passport] - Express-compatible authentication middleware for Node.js.
  - [Express-Session] - Session middleware for Express.

- **Database:**
  - [MongoDB] - A NoSQL database used for storing and retrieving user information.

## Features
- **Secure Authentication:**
  - Implemented secure sign-up and sign-in/out processes to ensure user data integrity.

- **Responsive Design:**
  - Designed with mobile users in mind, ensuring a seamless experience on various devices.

- **Scalable Database:**
  - Utilized Mongoose for managing user data, providing scalability as the user base grows.

## Deployment

The application is planned to be hosted on Netlify for the front end, providing a reliable and efficient hosting solution. The back end will be Dockerized to ensure scalability and easy deployment across different environments.

## Getting Started

To get started with the development or deployment of Tech Tutor Hub, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ggruenspan/tech-tutor-hub.git
   cd tech-tutor-hub

2. Install Depedencies
    ```bash
    # Install front-end dependencies
    cd client
    npm install

    # Install back-end dependencies
    cd server
    npm install

You need to run the application on HTTPS. To achieve this, follow these steps:

1. Run this command to install Chocolatey
      ```bash
      Set-ExecutionPolicy Bypass -Scope Process -Force iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
      ```
2. Run this to valid HTTPS certificates for localhost
      ```bash
      # You can put the files this command creates where every you want
      mkcery localhost
      ```

3. Run the application
    ```bash
    # Run the front end (Angular)
    cd client
    ng serve

    # Run the back end (Node.js)
    # Make sure you have your .env file in the same folder
    cd server
    npm run devStart

4. Open your browser and navigate to https://localhost:4200 to view the application

## License

MIT

**Free Software, Hell Yeah!**

   [AngularJS]: <http://angularjs.org>
   [Bootstrap]: <http://bootstrap/>
   [Node.js]: <http://nodejs.org>
   [Express]: <https://expressjs.com/>
   [Body-Parser]: <https://www.npmjs.com/package/body-parser>
   [Cors]: <https://www.npmjs.com/package/cors>
   [Passport]: <https://www.passportjs.org/>
   [Express-Session]: <https://www.npmjs.com/package/express-session>
   [MongoDB]: <https://www.mongodb.com/>
