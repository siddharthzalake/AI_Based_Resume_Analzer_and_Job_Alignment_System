import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/Context";
import ProtectedRoute from "./components/ProtectedRoutes";
import { Toaster } from "react-hot-toast";

import Home from "./pages/HomePage";
import Login from "./pages/Loginpages";
import Register from "./pages/RegisterPage";
import Analyze from "./pages/AnalyzePage";
import Result from "./pages/ResultPage";
import History from "./pages/HistoryPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    
    <AuthProvider>
      <BrowserRouter>

        {/* Global toast notifications */}
        <Toaster position="top-center" />

        <Navbar />

        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes (login required) */}
          <Route
            path="/analyze"
            element={
              <ProtectedRoute>
                <Analyze />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            }
          />

        </Routes>

        <Footer />

      </BrowserRouter>
    </AuthProvider>
  );
}
