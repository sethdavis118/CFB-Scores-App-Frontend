import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("https://localhost:3000/leaderboard");
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const data = await res.json();
        setLeaders(data);
      } catch (err) {
        console.error(`Error loading leaderboard: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading) return <p className="loading">Loading leaderboard...</p>;

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-header">Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.total_amount_won}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
