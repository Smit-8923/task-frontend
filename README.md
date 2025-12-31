# Task Management Frontend

A professional, modern, and fully responsive task management frontend built with React, Vite, Tailwind CSS, and shadcn/ui.

## Features

- **Professional Authentication**: Secure login and registration with JWT management.
- **Modern Dashboard**: Mobile-first design with a sleek sidebar and user profile management.
- **Responsive Design**: Optimized for all devices, especially mobile.
- **State Management**: Global authentication state using React Context.
- **API Integration**: Axios with interceptors for automatic token refresh.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Project Structure

- `src/components`: Reusable UI components and layout elements.
- `src/context`: React Context providers for global state.
- `src/lib`: Utility functions and API configuration.
- `src/pages`: Main application pages (Login, Register, Dashboard).
- `src/services`: API service layers for backend communication.
- `src/styles`: Global CSS and Tailwind configurations.
