import App from './App.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './router/routes.jsx';
import { StrictMode } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../src/styles/App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../src/styles/custom.css"; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)

// This is the entry point for the Soderia application.
// It imports necessary libraries and styles, and renders the main application routes using React Router.
// The application uses Bootstrap for styling and is structured to handle different routes like login, home, and admin pages.
// The StrictMode is used to help identify potential problems in the application during development.
// The application is rendered into the root element of the HTML document, which is expected to be present in the index.html file.
// The main.jsx file serves as the starting point for the React application, initializing the app and setting up routing.
// The application is designed to be modular, allowing for easy expansion and maintenance.
// The use of ReactDOM.createRoot is a modern approach to rendering React applications, providing better performance and features.
// The application is built using React, a popular JavaScript library for building user interfaces, and is structured to follow best practices in web development.
// The main.jsx file is essential for bootstrapping the React application and integrating it with the HTML document.
// The application is expected to be part of a larger project, possibly with additional features and functionalities.
// The main.jsx file is crucial for initializing the React application and setting up the routing structure.
// The application is designed to be responsive and user-friendly, leveraging modern web technologies.
// The main.jsx file is a key component of the Soderia application, serving as the entry point for the React application.
// The application is structured to allow for easy navigation between different pages, enhancing user experience.
// The main.jsx file is responsible for rendering the application and setting up the routing using React Router.
// The application is built with a focus on modularity and maintainability, allowing for future enhancements and features.
// The main.jsx file is a critical part of the Soderia application, ensuring that the app is rendered correctly and routes are managed effectively.
// The application is designed to be scalable, with the main.jsx file serving as the foundation for the React application.
// The main.jsx file is essential for bootstrapping the React application, integrating it with the HTML document, and managing routing.
