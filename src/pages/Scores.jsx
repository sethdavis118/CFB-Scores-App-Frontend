import Scorecard from "../components/Scorecard";
import { useState, useEffect } from "react";
import { apiFetch } from "../api/client.js";
import { fetchLiveGames, fetchUser } from "../api/ApiFunctions.js";

export default function Scores() {
  const [games, setGames] = useState([]);
  const [liveGames, setLiveGames] = useState();
  const [user, setUser] = useState();
  const date = new Date();
  const dayOfWeek = date.getDay();

  const getFavoriteGame = () => {
    if (user) {
      const favoriteGame = liveGames?.find(
        (game) =>
          game.awayTeam.id === user.favorite_team ||
          game.homeTeam.id === user.favorite_team
      );
      console.log(favoriteGame);
      return favoriteGame;
    }
  };

  const sortFunction = (a, b) => {
    if (a.status !== "completed") {
      if (a.startDate > b.startDate) {
        return 1;
      }
      if (b.startDate > a.startDate) {
        return -1;
      } else {
        return 0;
      }
    } else {
      return -1;
    }
  };

  useEffect(() => {
    async function fetchGames() {
      try {
        const result = await apiFetch("/scoreboard?classification=fbs");
        setGames(result);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    }

    fetchGames();
  }, []);

  const favoriteGame = getFavoriteGame();
  const gamesList = liveGames?.filter(
    (game) =>
      game.awayTeam.id !== user.favorite_team &&
      game.homeTeam.id !== user.favorite_team
  );
  gamesList?.sort(sortFunction);

  return (
    <>
      <section>
        <h1>Scores</h1>
        {games.length === 0 ? (
          <p>No games available</p>
        ) : (
          <ul>
            {games.map((g) => (
              <li key={g.id}>
                {g.home_team} vs {g.away_team} — {g.start_date}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
