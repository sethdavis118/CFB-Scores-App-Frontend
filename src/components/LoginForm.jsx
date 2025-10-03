import { useState } from "react";
import { useApi } from "../api/ApiContext.jsx";

export default function LoginForm() {
  const { request, setUser } = useApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await request("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", token);
      // optionally fetch /me after login
      const me = await request("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(me);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
