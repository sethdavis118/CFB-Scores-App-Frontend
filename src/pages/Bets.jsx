import { useState } from "react";

export default function Bets() {
  // A bet should contain:
  // Team wagered on, spread, amount
  // Game data (opponent, score, time remaining, etc.)
  const [games] = useState([
    {
      id: 1,
      home: "Tennessee",
      away: "Georgia",
      spread: "-3.5",
    },
    {
      id: 2,
      home: "Notre Dame",
      away: "Texas A&M",
      spread: "-1.5",
    },
    {
      id: 3,
      home: "LSU",
      away: "Florida",
      spread: "-7.5",
    },
  ]);

  const bet1 = {
    teamWager: "LSU",
    amountWagered: 50,
    gameId: 3,
  };

  // Function here

  const getScore = (betId) => {
    const game = games.find((game) => game.id === betId);
    return game;
  };

  const [bets, setBets] = useState([bet1]);
  const placeBet = (gameId, team) => {
    setBets([bets, { gameId, team }]);
  };
  console.log(bets);
  return (
    <>
      <div className="bets-page">
        <h2> Place Bets </h2>
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <h3>
              {game.away} @ {game.home}
            </h3>
            <p>Spread: {game.spread}</p>
            <button onClick={() => placeBet(game.id, game.home)}>
              {" "}
              Bet {game.home}
            </button>
            <button onClick={() => placeBet(game.id, game.away)}>
              {" "}
              Bet {game.away}
            </button>
          </div>
        ))}
      </div>
      <div className="your-bets">
        <h2> My Bets </h2>
        {bets.length === 0 ? (
          <p>No Bets Placed!</p>
        ) : (
          <ul>
            {bets.map((bet) => (
              <li>
                <p value={() => getScore(bet.gameId)}></p>
                {/*  Grab the value the function returns and display it */}
                <p>{bet.teamWager}</p>
                <p>{bet.amountWagered}</p>
              </li>
            ))}
            <p>What should we show if there are bets placed?</p>
          </ul>
        )}
      </div>
    </>
  );
}
// <ul>
//   {bets.map((bet, index) => (
//     const game = game.find((g) => g.id === bet.gameId);
//     return (
//       <li key={index}>
//         {bet.team}
//       </li>
