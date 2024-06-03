import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './app/app_styles.css'
import {MainPage, SchemaCreationPage} from './pages';

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
      <Router>
          <Routes>
              <Route path={"/"}
                     element={<MainPage />} />

              <Route path={"/schema_creation"}
                     element={<SchemaCreationPage />} />

              <Route path={"/schema_creation/:applicationId"}
                     element={<SchemaCreationPage />} />
          </Routes>
      </Router>
  // </React.StrictMode>
);
