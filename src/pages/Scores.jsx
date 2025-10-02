import Scorecard from "../components/Scorecard";
import { useState, useEffect } from "react";
import { fetchLiveGames, fetchUser } from "../api/ApiFunctions";

export default function Scores() {
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
    fetchLiveGames(setLiveGames);
    fetchUser(setUser);
  }, []);

  const favoriteGame = getFavoriteGame();
  const gamesList = liveGames?.filter(
    (game) =>
      game.awayTeam.id !== user?.favorite_team &&
      game.homeTeam.id !== user?.favorite_team
  );
  gamesList?.sort(sortFunction);

  return (
    <>
      <h1 className="scores-header">Scores</h1>
      {dayOfWeek === 0 ||
        (dayOfWeek === 1 && (
          <h3 className="scores-header">
            Next week's games will be available Tuesday!
          </h3>
        ))}
      <ul>
        <div className="favorite-game">
          {favoriteGame && <Scorecard game={favoriteGame}></Scorecard>}
          {/* An error message might be good, but I'm leaving it out for now because it shows in the background every time it's loading. */}
          {/* {!favoriteGame && (
            <h4>Your favorite team isn't playing this week!</h4>
          )} */}
        </div>
        {gamesList?.map((game) => (
          <Scorecard game={game} key={game.id} />
        ))}
      </ul>
    </>
  );
}
