import { useState } from "react";
import { useNavigate } from "react-router";
import useQuery from "../api/useQuery";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteTeam, setFavoriteTeam] = useState("");
  const [favoriteConf, setFavoriteConf] = useState("");
  const [error, setError] = useState("");

  // Fetch teams
  const {
    data: teams = [],
    loading: teamsLoading,
    error: teamsError,
  } = useQuery("/teams");

  // Fetch conferences
  const {
    data: conferences = [],
    loading: confLoading,
    error: confError,
  } = useQuery("/teams/conferences");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          favorite_team: favoriteTeam || null,
          favorite_conference: favoriteConf || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registration failed");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/account");
    } catch (err) {
      console.error(err);
      setError("Registration failed");
    }
  };

  if (teamsLoading || confLoading) return <p>Loading...</p>;
  if (teamsError || confError) return <p>Error loading data</p>;

  return (
    <div>
      <h2>Create Account</h2>
      {error && <p>{error}</p>}
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
                {team.school} ({team.mascot})
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
              <option key={index} value={conf}>
                {conf}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Account</button>
      </form>
      <p>
        Already have an account?{" "}
        <button onClick={() => navigate("/login")}>Login here</button>
      </p>
    </div>
  );
}
