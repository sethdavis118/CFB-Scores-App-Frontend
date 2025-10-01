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
      const favoriteGame = liveGames.find(
        (game) =>
          game.awayTeam.id === user.favorite_team ||
          game.homeTeam.id === user.favorite_team
      );
      console.log(favoriteGame);
      return favoriteGame;
    }
  };

  const sortFunction = (a, b) => {
    getFavoriteGame;
    // Does this completed logic work?
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

  liveGames?.sort(sortFunction);

  // const { data: games, loading, error } = useQuery("/games");
  // To show past games, use the above query and map "games" instead of futureGames.
  // const { data: game } = useQuery("/games/1");
  // const { data: futureGames } = useQuery("/upcoming");
  // if (loading || !liveGames) return <p>Loading...</p>;
  // if (error) return <p>Sorry! {error}</p>;

  // console.log(liveGames);

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
        {/* {user?.favorite_team} */}
        {liveGames?.map((game) => (
          <Scorecard game={game} key={game.id} />
        ))}
      </ul>
    </>
  );
}
