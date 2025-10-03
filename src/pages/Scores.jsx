import Scorecard from "../components/Scorecard";
import { useState, useEffect } from "react";
import { fetchLiveGames } from "../api/ApiFunctions.js";

export default function Scores() {
  const [liveGames, setLiveGames] = useState();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const sortedGames = await fetchLiveGames(setLiveGames);
        setLiveGames(sortedGames);
      } catch (err) {
        console.error("Error in Scores:", err);
        setError("Failed to load games.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p>Loading games...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h1 className="scores-header">Scores</h1>
      {games.length > 0 ?(
        <ul className = "games-list"></ul>
            {gamees.map((game) => (
              <li key={game.is} className = "game-card">
              <h2>
                {game.away_team} @ {game.home_team}
              </h2>
              <p>
                {game.away_points ?? "-"}:{game.home_points ?? "-"}
              </p>
              <p>
                {"take a loke at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString"}
                {new Date(game.start_date).toLocaleString("en-US",
                  {
                    "weekday":"short",
                    "month":"short",
                    "day":"numeric",
                    "hour":"numeric",
                    "minute":"2-digit",
                  }
                )}
              </p>
              <p>
                {game.completed?"Final": `Week ${game.season_week} ${game.seadon_type}`}
              </p>
              </li>
            ))}
      </ul>
        
}
