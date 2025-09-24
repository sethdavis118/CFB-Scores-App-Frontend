import { useEffect, useState } from "react";

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
  useEffect(() => {
    placeBet(1, "Tennessee");
    placeBet(2, "Texas A&M");
  }, []);

  return (
    <>
      <h1>My Bets</h1>
      <div className="bets-section">
        {bets.length === 0 ? (
          <p>No Bets Placed!</p>
        ) : (
          <ul className="bets-list">
            {bets.map((bet) => (
              <li key={bet.gameId} className="bet-items">
                <div className="bet-items-info">
                  <h3>
                    {bet.team} {bet.spread}
                  </h3>
                  <h3>${bet.amount}</h3>
                </div>
                <h6 className="bet-game-info">{bet.matchup}</h6>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
