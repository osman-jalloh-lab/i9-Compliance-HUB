# HR Immigration & Work Authorization Data Hub

A modern, AI-powered compliance platform designed for HR professionals to manage I-9, Visa, and Work Authorization data with speed and accuracy.

## 🚀 Key Features

### 🤖 Jarvis AI Assistant

* **Voice-Enabled**: Speak naturally to Jarvis using the integrated One-Click Dictation to get instant answers.
* **Context-Aware**: Expert knowledge on H-1B caps, EAD categories (C09, C08, etc.), and M-274 handbook rules.
* **Smart Floating UI**: A non-intrusive, "Right-Middle" floating window ensures Jarvis is always available without blocking your work.

### 📚 Interactive I-9 Playbook

* **Scenario Builder**: Visual decision trees to determine acceptable documents for List A, B, and C based on employee citizenship status.
* **Official Citations**: Every rule and scenario includes direct links to the official **USCIS M-274 Handbook** for authorized verification.
* **Searchable Database**: Instantly filter work authorization codes and visa types.

### 🔍 AI Technical Deep-Dives

* **Perplexity Powered**: Integrated with **Perplexity AI (sonar-reasoning)** for real-time regulatory research.
* **Live Updates**: Get the absolute latest DHS/USCIS news, extension policies, and federal register updates.

### 📄 Digital SOP Manager

* **Standardized Procedures**: Built-in, actionable guides for complex situations like Receipt Rules, Cap-Gap Extensions, and Reverification.
* **Audit-Ready Dashboard**: Keeps your compliance team aligned with verified, up-to-date procedures.

### 🎨 Premium User Experience

* **Mauve & Light Blue Theme**: A professional, clean aesthetic with modern Glassmorphism effects.
* **Interactive Landing Page**: Features dynamic Mesh Gradients and centralized navigation for quick access to tools.

## 🛠️ Tech Stack

* **Framework**: Next.js 14+ (App Router)
* **Database**: SQLite (via Prisma ORM)
* **Styling**: CSS Modules, Glassmorphism
* **AI**: Custom Chatbot & Perplexity API Integration

## Getting Started

1. **Clone the repository**:

    ```bash
    git clone https://github.com/YOUR_USERNAME/hr-immigration-hub.git
    cd hr-immigration-hub
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up Environment Variables**:
    Create a `.env` file in the root and add your keys:

    ```env
    PERPLEXITY_API_KEY=your_key_here
    DATABASE_URL="file:./dev.db"
    ```

4. **Run Development Server**:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to see the app.
