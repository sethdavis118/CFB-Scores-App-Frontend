import { useEffect, useState } from "react";
import { useApi } from "../api/ApiContext";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const request = useApi();

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await request("/leaderboard");
        setLeaders(data);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
      }
    }
    loadLeaderboard();
  }, [request]);

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
