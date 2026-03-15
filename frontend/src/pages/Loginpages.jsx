import { useState } from "react";
import { useAuth } from "../context/Context";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  
  const from = location.state?.from?.pathname || "/";

  const submit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      await login({ email, password });

      // Navigate after login
      navigate(from, { replace: true });

    } catch {
      // Error handling done in auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96">

        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <input
          placeholder="Email"
          value={email}
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full border p-2 mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-sm">
          No account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>

      </form>
    </div>
  );
}