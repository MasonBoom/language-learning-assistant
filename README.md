# LingoListen AI Project

## Overview

LingoListen AI is an innovative, AI-powered language learning platform designed to help users master conversations in any language. It leverages advanced technology to create an interactive and engaging learning experience. The project integrates various technologies, including Next.js, MongoDB, JWT for authentication, Tailwind CSS for styling, and Three.js for 3D graphics.

## Features

- **User Authentication:** Secure signup, login, and logout functionalities.
- **Language Preferences:** Users can select their native and learning languages, and set their proficiency level.
- **Interactive Voice Conversations:** Engage with the AI in voice conversations to improve conversational skills in the chosen language.
- **Personalized Dashboard:** Users have a personalized dashboard based on their language preferences and difficulty levels.
- **Responsive Design:** The application is fully responsive, ensuring a seamless experience across various devices.

## Technologies Used

- **Frontend:** React (Next.js), Tailwind CSS, Three.js
- **Backend:** Node.js, Express.js (handled implicitly by Next.js)
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Additional Libraries:** Mongoose, axios, bcryptjs, clsx, tailwind-merge

## Project Structure

- `models/`: Contains Mongoose models for the user.
- `helpers/`: Includes utility functions like token data extraction and Tailwind CSS class utilities.
- `components/`: React components for different sections of the application (header, footer, hero section, globe visualization, etc.).
- `pages/`: Next.js pages representing different routes of the application (login, signup, dashboard, etc.).
- `api/`: API routes for handling backend operations like user data retrieval, language preferences, and authentication.
- `dbConfig/`: Configuration for MongoDB connection.
- `globals.css`: Global CSS file including Tailwind CSS directives and custom styles.

## Installation and Setup

1. **Clone the repository:******
2. **Install dependencies:**
3. **Set up environment variables:**
Create a `.env.local` file in the root directory and add the necessary environment variables (e.g., `MONGODB_URI`, `TOKEN_SECRET`, `NEXT_PUBLIC_OPENAI_KEY`).

4. **Run the application:**
- Development mode: `npm run dev`
- Production mode: `npm run build` then `npm start`

## Usage

- Visit the homepage and sign up for an account using this link:  https://lingolisten-ai-67835a1e293b.herokuapp.com/
- Log in to access the personalized dashboard.
- Set your language preferences and start engaging with the AI in voice conversations.
- Explore various functionalities like changing language settings and managing your subscription.

## Contributions

Contributions are welcome. Please fork the repository and create a pull request with your features or fixes.
