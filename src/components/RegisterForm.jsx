import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../api/client.js";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteTeam, setFavoriteTeam] = useState("");
  const [favoriteConf, setFavoriteConf] = useState("");
  const [teams, setTeams] = useState("");
  const [conferences, setConferences] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [teamsData, conferencesData] = await Promise.all([
          apiFetch("/teams"),
          apiFetch("/conferences"),
        ]);
        setTeams(teamsData);
        setConferences(conferencesData);
      } catch (err) {
        console.error("Error fetching teams/conferences:", err);
      }
    }
    fetchData();
  }, []);

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const data = await apiFetch("/users/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });
      localStorage.setItem("token", data.token);
      navigate("/account");
    } catch (err) {
      setError("Registration failed: " + err.message);
    }
  }

  return (
    <div className="register-form">
      <h2>Create Account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Favorite Team:</label>
          <select
            value={favoriteTeam}
            onChange={(e) => setFavoriteTeam(e.target.value)}
          >
            <option value="">--Select a team--</option>
            {teams.map((team) => (
              <option key={team.id} value={team.team_id}>
                {team.school} {team.mascot}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Favorite Conference:</label>
          <select
            value={favoriteConf}
            onChange={(e) => setFavoriteConf(e.target.value)}
          >
            <option value="">--Select a conference--</option>
            {conferences.map((conf, index) => (
              <option key={index} value={conf.name || conf}>
                {conf.name || conf}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Account</button>
      </form>
      <p>
        Already have an account?{" "}
        <button type="button" onClick={() => navigate("/login")}>
          Login here
        </button>
      </p>
    </div>
  );
}
