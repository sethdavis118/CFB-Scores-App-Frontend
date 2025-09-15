import Scorecard from "../components/Scorecard";

export default function Scores() {
  // In reality, we'll likely fetch the color using a query from the team name, but for now I'm hard-coding it.
  const game1 = {
    homeScore: 21,
    awayScore: 7,
    homeTeam: "Tennessee",
    awayTeam: "Georgia",
    homeColor: "#FF8200",
    awayColor: "#BA0C2F",
    time: "11:08",
    quarter: 2,
  };

  const game2 = {
    homeScore: 40,
    awayScore: 41,
    homeTeam: "Notre Dame",
    awayTeam: "Texas A&M",
    homeColor: "#0c2340", //Or gold #ae9142
    awayColor: "#500000",
    time: "00:05",
    quarter: 4,
  };

  const game3 = {
    homeScore: 20,
    awayScore: 10,
    homeTeam: "LSU",
    awayTeam: "Florida",
    homeColor: "#FDD023",
    awayColor: "#0021A5",
    time: "00:00",
    quarter: 4,
  };

  const games = [game1, game2, game3];

  return (
    <ul>
      {games.map((game) => (
        <Scorecard game={game} />
      ))}
    </ul>
  );
}
