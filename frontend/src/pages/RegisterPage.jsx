import { useState } from "react";
import { useAuth } from "../context/Context";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {

  const { register } = useAuth();
  const navigate = useNavigate();

  // Form data state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const submit = async (e) => {
    e.preventDefault();

   
    await register(form);

    // Redirect to home page after registration
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96">

        <h2 className="text-2xl font-bold mb-6">Register</h2>

        <input
          placeholder="Name"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Register
        </button>

        <p className="mt-4 text-sm">
          Have account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}