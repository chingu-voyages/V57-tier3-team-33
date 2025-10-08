## React Router Setup and Usage in Vite + React Project

This document outlines the recommended way to handle client-side navigation in your React application built with Vite, using the **React Router** library.

### Why React Router?

React Router is the standard routing library for React applications. It provides a robust and declarative way to manage navigation, offering features such as:

*   **Declarative Routing:** Define your routes as React components.
*   **Nested Routes:** Easily create complex UI layouts with nested views.
*   **Dynamic Routing:** Handle routes with dynamic parameters (e.g., `/users/:id`).
*   **Programmatic Navigation:** Navigate users programmatically using history objects.
*   **Seamless Integration:** Works perfectly with React's component-based architecture and Vite's fast development server.

### Installation

First, you need to install the `react-router-dom` package:

```bash
npm install react-router-dom
```

### Basic Setup and Usage

To set up React Router, you typically wrap your entire application with a router component, usually in your entry file (`src/main.tsx`) or your main application component (`src/App.tsx`).

#### 1. Wrap Your Application with the Router (`src/main.tsx`)

It's best practice to wrap your root `App` component with `BrowserRouter` (or `HashRouter` if you prefer hash-based routing) in your `src/main.tsx` file. This makes the router context available throughout your application.

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router> {/* Wrap your App with Router */}
      <App />
    </Router>
  </React.StrictMode>,
);
```

#### 2. Define Your Routes and Navigation (`src/App.tsx`)

In your main application component (`src/App.tsx`), you will define your application's routes using the `Routes` and `Route` components. You'll also use the `Link` component for navigation.

```tsx
// src/App.tsx
import { Routes, Route, Link } from 'react-router-dom'; // Import Routes, Route, Link
import Home from './pages/Home'; // Assuming you have a Home component
import About from './pages/About'; // Assuming you have an About component
import Contact from './pages/Contact'; // Assuming you have a Contact component

function App() {
  return (
    <div>
      <nav> {/* Basic Navigation Bar */}
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <Routes> {/* Define your routes here */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
```

#### 3. Create Your Page Components (e.g., `src/pages/Home.tsx`)

Each `Route` element points to a component that will be rendered when that path is matched. You should create these components in separate files, typically within a `src/pages` directory.

```tsx
// src/pages/Home.tsx
import React from 'react';

const Home: React.FC = () => {
  return <h2>Home Page</h2>;
};

export default Home;
```

Create similar files for `src/pages/About.tsx` and `src/pages/Contact.tsx`.

### Key Components Used:

*   `<BrowserRouter>`: The top-level router component that enables client-side routing.
*   `<Routes>`: A container for all your `Route` components. It looks through its children `Route`s and renders the first one that matches the current URL.
*   `<Route>`: Defines a single route. It takes a `path` prop (the URL path) and an `element` prop (the React component to render).
*   `<Link>`: Used to create navigation links. It prevents a full page reload when clicked, allowing for a smooth SPA experience.

This basic setup provides a solid foundation for handling navigation in your React Vite application. For more advanced features like nested routes, route parameters, and navigation guards, refer to the official React Router documentation.

---

### Important Note on `localtunnel` Usage

When using `localtunnel` (`lt`) to expose your local development server, it is **crucial** to understand the following:

1.  **Your local development server MUST be running first.**
    `localtunnel` does not start your application; it only creates a public URL that *forwards requests* to an already running local server.
    Therefore, you must first start your Vite application (e.g., by running `npm run dev` in your project directory).

2.  **Use two separate terminal windows.**
    *   **Terminal 1:** Run your Vite development server (e.g., `npm run dev`). Keep this terminal open and running.
    *   **Terminal 2:** Open a *new* terminal window. In this terminal, run the `localtunnel` command, specifying the port your Vite app is running on.

    **Example (if your Vite app is on port 5173):**
    ```bash
    # In Terminal 1
    npm run dev

    # In Terminal 2 (after npm run dev is running)
    lt --port 5173
    ```
    `localtunnel` will then provide you with a public URL that you can share. If you close Terminal 1, your public `localtunnel` URL will stop working because the underlying local server is no longer available.