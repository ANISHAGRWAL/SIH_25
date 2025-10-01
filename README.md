# 🌱 Campus Care – Mental Health Platform for Students

**Campus Care** is a comprehensive digital mental health platform tailored for students in higher education. It offers a safe and supportive space for emotional well-being through self-assessments, peer forums, guided exercises, AI assistance, and professional counseling support — all integrated into one accessible system.

---

## 📽️ Project Demonstration

🎬 **Watch our full demo on YouTube**:  
[👉 Click Here to View the Video](https://youtu.be/5fYDuxr0PDE) 
This video walks through each feature one by one, explaining how it works and the impact it creates for student wellness.

---

## 🌟 Features

- 🎭 Real-time Mood Detection (Voice & Face)
- 📋 Self-Assessment Tools (PHQ-9, GAD-7, PSS)
- 💬 Anonymous Peer Support Forum
- 🧘 Guided Exercises (Yoga, Meditation, Breathing)
- 📓 Confidential Journaling + AI Insights
- 🕹️ Wellness & Memory Games
- 🤖 AI Mental Health Chatbot + Emergency SOS
- 📚 Multilingual Blog Hub & Resource Center
- 👩‍⚕️ One-Tap Counselor Booking
- 📊 Admin Analytics Dashboard (De-identified Cohorts)
- 🧑‍💼 Role-Based Access: User, Volunteer, Admin
- 🌐 Fully Responsive & Accessible UI

---

## 🧠 Problem Statement

Many students face mental health challenges but lack access to timely, stigma-free support. Traditional systems are fragmented, language-restricted, or overwhelming to navigate—especially in under-resourced institutions.

---

## 🚀 Our Solution

Campus Care combines mental health assessments, real-time emotional tracking, AI support, wellness content, and community-driven help — all within a private, multilingual platform. We aim to break the stigma, increase access, and promote proactive well-being.

---

## ⚙️ Tech Stack

### Frontend:
- **Next.js 14 (App Router)**
- **Tailwind CSS** + **ShadCN UI**
- **Capacitor.js** (for mobile compatibility)

### Backend:
- **Node.js + Express**
- **PostgreSQL** (via Neon DB)
- **Prisma ORM**

### AI/ML:
- **Facial Emotion Recognition** – MediaPipe / Custom ML
- **Voice Mood Detection** – Wav2Vec + Classifier
- **OpenAI API** – AI Reports & Chatbot Support

---

## 📲 Installation & Setup

### Prerequisites:
- Node.js 18+
- PostgreSQL DB (or Neon)
- Capacitor (optional for mobile)

### Clone & Install:
git clone https://github.com/<your-username>/campus-care.git
cd campus-care
npm install

Setup Environment

Create a .env file:

DATABASE_URL=your_postgres_connection_string
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_API_URL=http://localhost:5000

Run the App
For Frontend (Next.js)
npm run dev

For Backend (Express)
cd backend
npm install
npm run dev

For Mobile (Capacitor)
npx cap add android
npx cap open android

---

##  📂 Folder Structure
campus-care/
├── app/               # Frontend (Next.js)
├── backend/           # Backend (Express.js)
├── prisma/            # Database schema
├── public/            # Static assets
├── components/        # UI Components
├── utils/             # Utility Functions
└── README.md

---

## 🧑‍💻 Team Members

Anish Agarwal

Raj De Modak

Amar Pal

Aryan Kr Sinha

Shashank Shekhar

Ananya Mishra

---

## 🛡️ Data Privacy & Ethics

Journaling & mood data are confidential by default

Admin dashboard shows only de-identified trends

AI tools used only with user consent

Designed for privacy-first, student-centric experiences

---

## 📄 License

This project is currently not licensed.
All rights reserved by the authors.
Please contact the team for any reuse or contribution permissions.

---

## 🙌 Acknowledgements

This project was built as part of a hackathon to create real-world impact in student mental health through inclusive design, ethical AI, and accessible tech.

🧠 “Mental health is not a luxury. It's a right. Campus Care brings that right into reach.”
