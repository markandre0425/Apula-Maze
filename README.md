# Fire Safety Game (FSG)

An interactive educational web application designed to teach essential fire safety skills through engaging gameplay and informative content.

## 🔥 Overview

Fire Safety Game (FSG) combines 3D gameplay with educational resources to help users learn critical fire safety skills that could save lives in emergencies. Navigate through realistic scenarios, make quick decisions, and collect safety tips along the way.

## ✨ Key Features

- **Interactive 3D Gameplay**: Navigate through realistic fire emergency scenarios
- **Educational Content**: Comprehensive safety guide with collectible tips
- **Progressive Learning**: Multiple levels with increasing difficulty
- **Knowledge Testing**: Quiz system to test and reinforce learning
- **Mobile Optimized**: Responsive design with touch controls for all devices

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Three.js, React Three Fiber
- **State Management**: Zustand
- **Backend**: Express.js, PostgreSQL, Drizzle ORM
- **Build Tools**: Vite, esbuild

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database or Neon account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fire-safety-game.git
cd fire-safety-game

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with DATABASE_URL

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Build and Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📱 Application Structure

### Pages
- **MainMenu**: Entry point with navigation options
- **Game**: Main gameplay environment
- **LevelSelect**: Interface for choosing game levels
- **SafetyGuide**: Educational resource with collected safety tips
- **GameOver**: Results screen after completing or failing a level
- **QuizPage**: Knowledge assessment interface

### Game Features
- Realistic fire and smoke particle effects
- Character movement and interaction
- Collectible items and extinguishable hazards
- Time-based challenges
- Progressive difficulty

## 🧩 Development

The application uses a modular architecture with:

- React components for UI elements
- Zustand stores for state management
- Three.js for 3D rendering
- Express.js for API endpoints

Server automatically finds an available port if the default port 5000 is in use.

## 📚 Educational Content

The game includes:
- Fire prevention tips
- Emergency response procedures
- Evacuation strategies
- Fire extinguisher usage guidance
- Smoke and fire safety knowledge

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Fire safety experts for content verification
- Open source libraries and tools that made this project possible