import { useState, useEffect } from "react";

export default function Account() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [favoriteTeam, setFavoriteTeam] = useState("");
  const [favoriteConf, setFavoriteConf] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    async function fetchData() {
      const [teamsRes, confRes, userRes] = await Promise.all([
        fetch(" /teams"),
        fetch("/teams/conferences"),
        fetch(`/users/${userId}`),
      ]);

      const [teamsData, confData, userData] = await Promise.all([
        teamsRes.json(),
        confRes.json(),
        userRes.json(),
      ]);

      setTeams(teamsData);
      setConferences(confData);
      setUser(userData);
      setFavoriteTeam(userData.favorite_team || "");
      setFavoriteConf(userData.favorite_conference || "");
    }

    fetchData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    try {
      const res = await fetch(`/api/users/${userId}/favorites`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          favorite_team: favoriteTeam,
          favorite_conference: favoriteConf,
        }),
      });
      const updatedUser = await res.json();
      setUser(updatedUser);
      alert("Favorites updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update favorites");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Account Page</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>

      <form onSubmit={handleUpdate}>
        <div>
          <label>Favorite Team:</label>
          <select value={favoriteTeam} onChange={(e) => setFavoriteTeam(e.target.value)}>
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
          <select value={favoriteConf} onChange={(e) => setFavoriteConf(e.target.value)}>
            <option value="">--Select a conference--</option>
            {conferences.map((conf) => (
              <option key={conf.id} value={conf.name}>
                {conf.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Update Favorites</button>
      </form>
    </div>
  );
}
