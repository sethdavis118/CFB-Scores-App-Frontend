import Scorecard from "../components/Scorecard";

import useQuery from "../api/useQuery";

export default function Scores() {
  // In reality, we'll likely fetch the color using a query from the team name, but for now I'm hard-coding it.
  const { data, loading, error } = useQuery("/teams/106"); //No tag provided for now.
  const { data: games } = useQuery("/games");
  const { data: game } = useQuery("/games/1");
  if (loading || !data) return <p>Loading...</p>;
  if (error) return <p>Sorry! {error}</p>;

  const testGame = game?.rows[0];
  const home_team_id = testGame?.home_team_id;
  const away_team_id = testGame?.away_team_id;

  // --- Sample data ---
  // const game1 = {
  //   homeScore: 21,
  //   awayScore: 7,
  //   homeTeam: "Tennessee",
  //   awayTeam: "Georgia",
  //   homeColor: "#FF8200",
  //   awayColor: "#BA0C2F",
  //   time: "11:08",
  //   quarter: 2,
  // };
  // const game2 = {
  //   homeScore: 40,
  //   awayScore: 41,
  //   homeTeam: "Notre Dame",
  //   awayTeam: "Texas A&M",
  //   homeColor: "#0c2340", //Or gold #ae9142
  //   awayColor: "#500000",
  //   time: "00:05",
  //   quarter: 4,
  // };
  // const game3 = {
  //   homeScore: 20,
  //   awayScore: 10,
  //   homeTeam: "LSU",
  //   awayTeam: "Florida",
  //   homeColor: "#FDD023",
  //   awayColor: "#0021A5",
  //   time: "00:00",
  //   quarter: 4,
  // };
  // const gamesList = [game1, game2, game3];
  // --- Sample data ---

  // Create a function that can grab the team by the team_id after getting a game.
  // This may require some additions to the backend.

  const TnObject = data;

  console.log(TnObject);
  console.log(games);
  console.log(home_team_id, away_team_id);
  return (
    <ul>
      {games?.map((game) => (
        <Scorecard game={game} key={game.id} />
      ))}
    </ul>
  );
}
