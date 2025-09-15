// I'm going to pass in a game object that will include the team names, the score, and time remaining.
// I may also eventually pass in a bets object that will include relevant information for that data.
export default function Scorecard(game) {
  const {
    homeScore,
    awayScore,
    homeTeam,
    awayTeam,
    homeColor,
    awayColor,
    time,
    quarter,
  } = game.game;
  // In reality, we'll likely fetch the color using a query from the team name, but for now I'm hard-coding it.

  let quarterStr;
  if (quarter === 1) {
    quarterStr = "1st";
  } else if (quarter === 2) {
    quarterStr = "2nd";
  } else if (quarter === 3) {
    quarterStr = "3rd";
  } else {
    quarterStr = "4th";
  }

  console.log(homeScore);
  return (
    <li className="scorecard">
      <h4 style={{ color: awayColor }}>{awayTeam}</h4>
      <p>{awayScore}</p>
      <h4 style={{ color: homeColor }}>{homeTeam}</h4>
      <p>{homeScore}</p>
      <div className="scorecard-clock">
        <h4 className="scorecard-clock-item">{quarterStr}</h4>
        <p className="scorecard-clock-item">{time}</p>
      </div>
      <p>{game.game?.betTeam}</p>
      <p>{game.game?.betLine}</p>
    </li>
  );
}
