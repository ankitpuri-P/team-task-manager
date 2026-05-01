import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Login page is the default screen */}
        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
        
        {/* The Dashboard is accessible at /dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;