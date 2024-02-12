import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './views/Home';
import Login from './views/Login';
import Postgres from './views/Postgres';
import Register from './views/Register';
// import SqlServer from './views/SqlServer';
import SqlServerMigration from './views/SqlServerMigration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        {/* <Route path="/sql-server" element={<PrivateRoute><SqlServer /></PrivateRoute>} /> */}
        <Route path="/sql-server-migration" element={<PrivateRoute><SqlServerMigration /></PrivateRoute>} />
        <Route path="/postgres" element={<PrivateRoute><Postgres /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
