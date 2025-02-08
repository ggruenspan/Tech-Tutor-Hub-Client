# 🎓 Tech Tutor Hub (Client)

## 📌 Overview

Tech Tutor Hub is an ongoing project aimed at developing a web application that **connects users with tutors tailored to their specific needs** while providing a sleek and user-friendly interface.  

🚀 **Built with:**  
✅ **Angular** – for a dynamic and modern front-end experience.  
✅ **Bootstrap** – for responsive design and mobile-first development.  

The application is **mobile-friendly**, **accessible**, and **designed for scalability**.  

---

## 🎨 Design Preview

Here are some **preview images** showcasing the design of Tech Tutor Hub:  

### ⭐ Home - Reviews  
Displays tutor reviews, allowing users to evaluate their experiences.  
<img src="https://github.com/ggruenspan/Tech-Tutor-Hub/blob/main/design/homeReviews.png" alt="Home - Reviews" width="500"/>

### 👤 Profile Page  
Shows all relevant information about the user based on their role.  
<img src="https://github.com/ggruenspan/Tech-Tutor-Hub/blob/main/design/proflie.png" alt="Profile" width="500"/>

### 📚 Mentors List  
Displays a directory of available mentors for easy access.  
<img src="https://github.com/ggruenspan/Tech-Tutor-Hub/blob/main/design/mentors.png" alt="Mentors" width="500"/>

---

## 🛠 Technologies Used  

- **[AngularJS]** – A powerful front-end framework for building dynamic web applications.  
- **[Bootstrap]** – A widely used CSS framework for creating responsive designs.  

---

## ✨ Features

✅ **Responsive & Mobile-Friendly** – Designed with mobile users in mind for a seamless experience.  
✅ **Fast & Efficient** – Optimized for performance and user engagement.  
✅ **Easy Navigation** – Simple and intuitive UI for quick access to tutors and resources.  

---

## 🚀 Deployment

Tech Tutor Hub (Client) is planned to be **hosted on Netlify**, ensuring a reliable and efficient hosting solution.

---

## 🛠 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ggruenspan/tech-tutor-hub-client.git
cd tech-tutor-hub-client
```

### 2️⃣ Install Dependencies  

```bash
npm install
```

### ⚠️ **Environment Configuration (Required)**
Before running the application, ensure you have a `.env` file with the required API endpoints and secrets.

---

## 🔒 Running the Application on HTTPS  

To run the application securely on HTTPS, follow these steps (based on [Medium.com]):  

1️⃣ **Open PowerShell as Administrator**  
   Run:
   ```bash
   Get-ExecutionPolicy 
   ```
   If it returns **Restricted**, then execute:
   ```bash
   Set-ExecutionPolicy AllSigned or Set-ExecutionPolicy Bypass -Scope Process.
   ```

2️⃣ **Install Chocolatey**  
   ```bash
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

3️⃣ **Install `mkcert` via Chocolatey**  
   ```bash
   choco install mkcert
   ```

4️⃣ **Create a Trusted Certificate Authority**  
   ```bash
   mkcert -install
   ```

5️⃣ **Generate HTTPS Certificates for Localhost**  
   ```bash
   mkcert localhost
   ```

---

## 🔗 Setting Up the Server

To fully use the application, you **must** set up the **server-side repository** as well.  

📌 Follow the instructions in the **[Server Repository]** to get started.

---

## ▶️ Running the Application

```bash
ng serve
```

Then, open your browser and go to:  

🌐 **[https://localhost:4200](https://localhost:4200)**  

---

## 📜 License

MIT  

💡 **Free Software, Hell Yeah!** 🎉  

---

### 🔗 References  

- [AngularJS] – <http://angularjs.org>  
- [Bootstrap] – <http://bootstrap/>  
- [Server Repository] – <https://github.com/ggruenspan/Tech-Tutor-Hub-Server>  
