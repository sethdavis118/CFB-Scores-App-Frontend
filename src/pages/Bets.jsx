import { useState } from "react";

export default function Bets() {
  //   // A bet should contain:
  //   // Team wagered on, spread, amount
  //   // Game data (opponent, score, time remaining, etc.)
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

  const [bets, setBets] = useState([]);
  const [amount, setAmount] = useState(50);

  const placeBet = (gameId, team) => {
    const game = games.find((g) => g.id === gameId);
    const newBet = {
      gameId,
      team,
      amount,
      spread: game.spread,
      matchup: `${game.away} @ ${game.home}`,
    };
    setBets([...bets, newBet]);
  };

  return (
    <>
      <div className="bets-page">
        <h2>Place Bets</h2>
        <label>
          Wager Amount:{" "}
          <select
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          >
            {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>

        {games.map((game) => (
          <div key={game.id} className="game-card">
            <h3>
              {" "}
              {game.away} @ {game.home}
            </h3>
            <p>Spread: {game.spread}</p>
            <button onClick={() => placeBet(game.id, game.home)}>
              Bet {game.home}
            </button>
            <button onClick={() => placeBet(game.id, game.away)}>
              Bet {game.away}
            </button>
          </div>
        ))}
      </div>

      <div className="your-bets">
        <h2>My Bets</h2>
        {bets.length === 0 ? (
          <p>No Bets Placed!</p>
        ) : (
          <ul>
            {bets.map((bet) => (
              <li key={bet.id}>
                {bet.team} ({bet.spread}) · {bet.matchup} — ${bet.amount}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
