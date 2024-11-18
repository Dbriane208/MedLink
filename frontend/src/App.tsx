import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import HomePage from './pages/Home/HomePage';
import LandingPage from './pages/Landing/LandingPage';
function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
    <BrowserRouter>
      <Routes>
        {/* Define the routes for each component */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
  </BrowserRouter>
</QueryClientProvider>
  )
}

export default App
