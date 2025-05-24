# audhd.ai - Adaptive Neurodiversity Empowerment Companion

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-brightgreen.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.49.4-green.svg)](https://supabase.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.11-blueviolet.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

<div align="center">
  <img src="/public/lovable-uploads/7ad3926c-6b1e-49e0-8dc6-5430f621384e.png" alt="audhd.ai logo" width="120" />
  <h3>Empowering neurodivergent individuals with AI-driven personalized support</h3>
</div>

## 🌟 Overview

audhd.ai is a compassionate digital platform designed specifically for individuals with neurodivergent traits, including ADHD, autism, dyslexia, and other cognitive variations. Our mission is to empower neurodivergent individuals by providing personalized tools and insights that celebrate cognitive diversity.

The application combines evidence-based research with AI technology to create a supportive environment where users can understand their unique cognitive profile, discover their inherent strengths, and access tailored techniques that complement their thinking style.

## ✨ Features

### 🧠 Dynamic Personalized Self-Assessment
- Adaptive questionnaires that evolve based on user data and emerging research
- Questions sourced from reputable organizations like ADHD UK and Plymouth NHS
- Intuitive interface prioritizing accessibility and user experience

### 📊 Intelligent Strength & Weakness Profiling
- Dynamic profiling that adapts to user data and evolving research
- Visual representations of patterns and trends for long-term tracking
- Progress tracking and achievement celebration with emphasis on adaptability

### 🔍 Evidence-Based Research & Technique Recommendation
- Autonomous daily research of reputable scientific papers on ADHD and Autism
- AI-driven analysis of research findings to identify relevant techniques
- Personalized technique recommendations focused on leveraging strengths

### 💬 AIva - Chat
- Personalized AI chat that understands neurodivergent needs
- Contextual support based on user profile and history
- Evidence-based guidance and strategies

### 🎨 Customization and Accessibility
- "Colour your day" feature with custom theme options
- Dark mode and high-contrast mode for accessibility
- Responsive design for all devices

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe component development
- **Vite** for lightning-fast builds and development experience
- **TailwindCSS** with shadcn/ui components for beautiful, accessible UI
- **React Router** for client-side routing
- **React Query** for efficient server state management
- **Recharts** for data visualization

### Backend
- **Supabase** for authentication, database, and serverless functions
- **PostgreSQL** with Row-Level Security for secure data storage
- **Edge Functions** for serverless API endpoints
- **Vector embeddings** for AI-powered recommendations

### AI Integration
- LLM integration for personalized recommendations
- Research paper analysis and technique extraction
- Personalized coaching based on user profile

## 📋 Project Structure

```
audhd.ai/
├── src/                  # Application source code
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # External service integrations
│   ├── lib/              # Utility functions and helpers
│   ├── pages/            # Application pages/routes
│   └── utils/            # Utility functions
├── supabase/             # Supabase configuration
│   ├── functions/        # Edge Functions
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── core/                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend functionality)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/audhd.ai.git
cd audhd.ai
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:8080](http://localhost:8080) in your browser

## 🔒 Privacy & Security

audhd.ai prioritizes user privacy and data security:

- End-to-end encryption for sensitive user data
- Transparent data handling practices
- User control over data sharing
- Regular security audits and updates

## 📄 License

**audhd.ai © 2025 by L Rehm**  
This project is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

For questions or feedback, please open an issue on this repository or contact the maintainers directly.

---

<div align="center">
  <p>Built with ❤️ for the neurodivergent community</p>
</div>