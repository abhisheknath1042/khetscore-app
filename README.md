# 🌾 KhetScore – Agricultural Practices Simulation App

KhetScore is an interactive web-based simulation platform that helps evaluate the impact of adopting good agricultural practices (GAPs) across multiple crop seasons (Rabi & Kharif).  
It enables users to simulate farmer decisions, assess weather impacts, and track the evolution of farm productivity scores (**KhetScore**) over time.

---

## 🚀 Features

- 🔐 **User Authentication** (Register/Login using local storage)
- 🌾 **Farmer Data Import** (CSV upload with pre-loaded farmer details)
- 🧮 **Multi-Season Simulation** (Rabi → Kharif → Rabi cycles)
- 🌦️ **Random Weather Events** (drought, flood, pest attack, etc.)
- 📈 **Dynamic KhetScore Calculation**
- 📋 **Likelihood Assessment** for each chosen practice
- 💾 **Export to CSV** (stores results per farmer)
- 💻 **Dashboard** for tracking previous simulations
- 🎨 **Modern UI** powered by **React + Tailwind CSS + Lucide Icons**

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React (Create React App) |
| Styling | Tailwind CSS |
| CSV Handling | Papa Parse |
| Icons | Lucide React |
| Storage | Browser LocalStorage |
| Deployment | GitHub Pages |

---

## 📦 Project Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/khetscore-app.git
cd khetscore-app
npm install
npm install react-scripts@5.0.1
npm install papaparse lucide-react
npm start
```
### Folder Structure

```bash
khetscore-app/
│
├── public/                 # Static assets
├── src/
│   ├── App.js              # Main React component
│   ├── App.css             # Global styles
│   ├── index.css           # Tailwind + base styling
│   └── index.js            # React entry point
│
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS config for Tailwind
├── package.json            # Dependencies & scripts
└── README.md               # This file
```

## 🌿 Running a Simulation

1. Login / Register a user
    - Credentials are stored in your browser’s local storage.

2. Upload a Farmer CSV
    - File should include: Name, farmerID, Khetscore.

3. Select a Farmer
    - Enter the farmerID to load details.

4. Choose Practices
    - Select at least 7 from the 24 available good agricultural practices.

5. Weather Simulation
    - A random weather shock (or none) affects the score.

6. Likelihood Survey
    - Answer how likely the farmer is to actually perform each chosen practice.

7. Repeat for 3 Seasons
    - The app simulates Rabi → Kharif → Rabi cycles automatically.

8. View Summary & Export Results
    - Get a detailed report of all selections and KhetScore evolution per season.
    - Export as .csv.

`newScore = currentKhetscore + sum(selectedPracticeWeights) - (shockImpact * currentKhetscore)`
- Each practice adds a weighted score bonus.
- Random weather shocks apply a negative multiplier.

## 🌐 Deployment Guide (GitHub Pages)

1️⃣ Install GitHub Pages package

```bash npm install gh-pages --save-dev ```

2️⃣ Update package.json

Add the following lines:
```bash
{
  "homepage": "https://<your-username>.github.io/khetscore-app",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```
🔹 Replace <your-username> with your actual GitHub username.

3️⃣ Commit the changes
```bash
git add package.json
git commit -m "Configure GitHub Pages deployment"
git push
```

4️⃣ Deploy to GitHub Pages
```bash
npm run deploy
```

This will:
Build your React app (npm run build)
Deploy it to the gh-pages branch on your GitHub repo

5️⃣ Verify Deployment

Visit your site at:

👉 https://<your-username>.github.io/khetscore-app

### 🧰 Useful Commands
Command	Description
```bash
npm start	Run development server
npm run build	Create production build
npm run deploy	Deploy to GitHub Pages
npm test	Run tests (if added)
npm run lint	Lint code (optional setup)
```

### 📜 License

This project is open-source and available under the MIT License.

### 👨‍💻 Author

Abhishek Nath  
Software Developer.

🌐 [GitHub Profile](https://github.com/abhisheknath1042)

---
