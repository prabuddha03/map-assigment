# Interactive Map Assignment

A modern, responsive web application built with **Next.js 15** and **TypeScript** that provides interactive mapping functionality with weather data visualization. This project demonstrates advanced React development skills, state management with Redux, and real-time data integration.

## 🚀 Live Demo

- **Primary Assignment**: [Map Interface](/map) - Interactive mapping with weather data
- **Bonus Dashboard**: [Dashboard](/dashboard) - Comprehensive IoT dashboard (initial approach)

## 📸 Screenshots

### Desktop Interface

![Desktop Main View](/desktop2.webp)
_Main map interface with polygon drawing, weather data visualization, and timeline controls_

![Desktop Controls](/desktopmain.webp)
_Detailed view of map controls, polygon management, and color rule configuration_

### Mobile Responsive Design

![Mobile Basic View](/mobile-basic.webp)
_Mobile-optimized interface with touch-friendly controls_

![Mobile Menu](/mobile-menu.webp)
_Mobile sidebar with polygon management and settings_

### Data Persistence

![Local Storage](/localstorage.webp)
_Browser developer tools showing localStorage persistence of polygon data_

## ✨ Key Features

### Core Functionality

- **Interactive Map Drawing**: Draw and edit polygons directly on the map using React-Leaflet
- **Real-time Weather Data**: Integration with Open-Meteo API for temperature, precipitation, and wind data
- **Dynamic Color Rules**: User-defined color coding based on weather conditions
- **Timeline Controls**: 30-day historical data range with hourly precision
- **Polygon Management**: Name, save, and organize multiple map polygons
- **Mobile Responsive**: Full mobile support with touch-friendly controls

### Advanced Features

- **State Persistence**: LocalStorage integration with Redux for data persistence
- **Smart Tooltips**: Interactive polygon tooltips with real-time weather information
- **Area Calculations**: Accurate geospatial area calculations with latitude-aware formulas
- **Multi-data Support**: Temperature, precipitation, and wind speed visualization
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Error Handling**: Comprehensive error handling with user-friendly notifications

## 🛠️ Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 19** - Latest React features
- **React-Leaflet** - Interactive map components
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern UI components

### Backend & APIs

- **Next.js API Routes** - Custom weather data endpoints
- **Open-Meteo API** - Weather data provider
- **React Query** - Server state management

### Development Tools

- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📋 Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- Modern web browser with JavaScript enabled

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd map-assignment-mindweb/map-assignment-next
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

### 4. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing

```bash
npm test             # Run all tests
npm test -- --watch # Run tests in watch mode
npm test -- --coverage # Run tests with coverage report
```

### Type Checking

```bash
npx tsc --noEmit     # Check TypeScript errors without emitting files
```

## 🧪 Testing

This project includes comprehensive testing with **Jest** and **React Testing Library**.

### Test Coverage

- **Component Tests**: All major components have unit tests
- **Integration Tests**: Map page integration testing
- **State Management**: Redux slice testing
- **API Routes**: Weather data endpoint testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test Map.test.tsx

# Run tests with coverage
npm test -- --coverage
```

### Test Files Structure

```
src/
├── app/__tests__/           # Page-level tests
├── components/__tests__/    # Component tests
└── store/__tests__/         # State management tests
```

## 🏗️ Project Structure

```
map-assignment-next/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── map/           # Map page
│   │   └── page.tsx       # Homepage
│   ├── components/         # React components
│   │   ├── ui/            # Shadcn/ui components
│   │   └── __tests__/     # Component tests
│   ├── store/             # Redux store
│   │   └── slices/        # Redux slices
│   ├── types/             # TypeScript type definitions
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
├── public/                # Static assets
└── __tests__/            # Global test files
```

## 🗺️ Map Features

### Polygon Drawing

- Click to start drawing polygons
- Double-click to complete polygon
- Edit existing polygons by dragging vertices
- Delete polygons with confirmation

### Weather Data Integration

- Real-time weather data from Open-Meteo API
- Support for multiple data types:
  - Temperature (°C)
  - Precipitation (mm)
  - Wind Speed (km/h)
- Historical data for past 30 days
- Hourly data resolution

### Color Rules

- Create custom color rules based on weather conditions
- Support for greater than (>) and less than (<) operators
- Dynamic polygon coloring based on current weather data
- Visual legend showing color mappings

### Timeline Controls

- 30-day historical data range
- Hourly time selection
- Smooth timeline scrubbing
- Real-time data updates

## 🎨 Design Features

- **Modern UI**: Clean, professional interface design
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching capability
- **Smooth Animations**: Polished user interactions
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Skeleton loaders for better UX

## 🔧 Configuration

### Environment Variables

No environment variables required - the application uses public APIs.

### API Configuration

Weather data is fetched from Open-Meteo API through custom Next.js API routes located in `src/app/api/weather-data/route.ts`.

## 🐛 Known Issues & Solutions

### Resolved Issues

1. **API Date Validation**: Fixed 400 Bad Request for future dates by using historical data
2. **Per-Polygon Data**: Resolved global state issues with polygon-specific data storage
3. **Mobile Responsiveness**: Fixed overlapping controls with proper z-index management
4. **Data Persistence**: Implemented localStorage integration for polygon data
5. **Leaflet Overlays**: Fixed drawing overlay removal and layer management
6. **Area Calculations**: Implemented accurate geospatial calculations

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

```bash
npx vercel
```

The application is optimized for deployment on Vercel with Next.js.

## 🧑‍💻 Development Process

### Git Workflow

- **Main Branch**: Production-ready code
- **Dev Branch**: Development and feature integration
- **Feature Branches**: Individual feature development
- **Pull Requests**: Code review process

### Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Component Testing**: Comprehensive test coverage
- **Code Reviews**: Pull request reviews before merging

## 📊 Performance Optimizations

- **API Caching**: Weather data caching to reduce API calls
- **Component Lazy Loading**: Dynamic imports for better performance
- **State Optimization**: Efficient Redux state updates
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Splitting**: Automatic code splitting with Next.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of a hiring assignment and is for demonstration purposes.

## 👨‍💻 Author

**Prabuddha Choudhury**

- Full Stack Developer with 11+ months of internship experience
- Passionate about backend-heavy problem-solving and debugging complex issues
- 300+ LeetCode problems solved
- [View CV](https://pub-59b3362b9c604d388203b247ffff7743.r2.dev/Prabuddha_Chowdhury.pdf)

---
