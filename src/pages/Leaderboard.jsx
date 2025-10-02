import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await apiFetch("/leaderboard");
        setLeaderboard(data);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
        setError("Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>User</th>
          <th>Total Points</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard?.length > 0
          ? leaderboard.map((user) => (
              <tr key={user.id ?? user.username}>
                <td>{user.username}</td>
                <td>{user.total_amount_won}</td>
              </tr>
            ))
          : null}
      </tbody>
    </table>
  );
}
