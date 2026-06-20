import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Bootstrap (responsive grid + utilities) — loaded before our design system so we can override.
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/design-system.css';
import './styles/hero.css';
import './styles/partners-carousel.css';
import './styles/about-us.css';
import './styles/vision2030.css';
import './styles/projects.css';
import './styles/slogan-sectors.css';
import './styles/testimonials.css';
import './styles/index.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './lib/auth.jsx';
import { CartProvider } from './lib/cart.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
