# Tech Tutor Hub (Client)

## Overview

Tech Tutor Hub is an ongoing project aimed at developing a web application that facilitates finding a tutor tailored to users' specific needs, employing a sleek and user-friendly interface. The primary technologies utilized in this project include Angular for the front end and Bootstrap for responsive design. The application is designed to be mobile-friendly and accessible.

## Design Preview

Here are some design previews of Tech Tutor Hub:

<img src="https://github.com/ggruenspan/Tech-Tutor-Hub/blob/main/design/homeReviews.png" alt="Home - Reviews" width="500"/>
- This section of the home page displays reviews of tutors.

<img src="https://github.com/ggruenspan/Tech-Tutor-Hub/blob/main/design/proflie.png" alt="Proflie" width="500"/>
- This is a user profile, showing all relevant information based on the user's role.

<img src="https://github.com/ggruenspan/Tech-Tutor-Hub/blob/main/design/mentors.png" alt="Mentors" width="500"/>
- This section lists all available mentors on the site.

## Technologies Used
  - [AngularJS] - A powerful front-end framework for building dynamic web applications.
  - [Bootstrap] - A popular CSS framework for creating responsive and mobile-first designs.

## Features
- **Responsive Design:**
  - Designed with mobile users in mind, ensuring a seamless experience on various devices.

## Deployment

The application is planned to be hosted on Netlify, providing a reliable and efficient hosting solution.

## Getting Started

To get started with the development of Tech Tutor Hub client-side, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ggruenspan/tech-tutor-hub-client.git
   cd tech-tutor-hub-client
    ```
2. Install Dependencies
    ```bash
    # Install dependencies
    npm install
    ```
You need to run the application on HTTPS. To achieve this, follow these steps from [Medium.com]:
1. First, open PowerShell as administrator
    Run
    ```bash
    Get-ExecutionPolicy 
    ```
    If it returns Restricted, then run 
    ```bash
    Set-ExecutionPolicy AllSigned or Set-ExecutionPolicy Bypass -Scope Process.
    ```
2. Run this command to install Chocolatey
    ```bash
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    ```
3. After install Chocolatey, we can install mkcert using
    ```bash
    choco install mkcert
    ```
4. Now we create a trusted certificate authority in our system’s root store
    ```bash
    mkcert -install
    ```
5. Run this to valid HTTPS certificates for localhost
    ```bash
    # You can put the files this command creates wherever you want
    mkcert localhost
    ```
6. Download the Server Repository:

To complete the application, you'll need to download and set up the server side of Tech Tutor Hub. Follow the instructions in the [Server Repository] to get started.

7. Run the application
    ```bash
    ng serve
    ```
8. Open your browser and navigate to https://localhost:4200 to view the application

## License

MIT

**Free Software, Hell Yeah!**

   [AngularJS]: <http://angularjs.org>
   [Bootstrap]: <http://bootstrap/>
   [Server Repository]: <>
