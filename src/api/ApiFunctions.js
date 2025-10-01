// Gets the team by its team_id, not id.
export async function getTeam(id, token) {
  const response = await fetch(`http://localhost:3000/teams/team_id/${id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (!response.ok) throw Error(result?.message ?? "Something went wrong.");
  return result;
}

export async function editBetWinStatus(id, token, winStatus) {
  console.log("Editing win status");
  console.log(winStatus);
  try {
    const res = await fetch(`http://localhost:3000/bets/update/${id}`, {
      //Fix the route later
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ winStatus }), //What belongs in here?
    });

    if (!res.ok) {
      const data = await res.json();
      console.error(data.error);
      return;
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

// async function to set the win_status either true or false.
export async function checkIsCompleted(
  token,
  betGame,
  isComplete,
  setIsComplete
) {
  let completed;
  let awayPoints;
  let homePoints;
  if (betGame) {
    try {
      const response = await fetch(
        `https://api.collegefootballdata.com/games?id=${betGame?.game_id}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_SCOREBOARD_BEARER_TOKEN
            }`,
          },
        }
      );
      const result = await response.json();
      if (!response.ok) throw Error(result?.message ?? "Something went wrong.");
      completed = result[0].completed;
      awayPoints = result[0].awayPoints;
      homePoints = result[0].homePoints;
    } catch (error) {
      console.error(error);
    }
  }

  // Might ditch this section later.
  // This blends too weirdly with updateIsCompletedStatus
  if (completed) {
    setIsComplete(true);
    const isUpdated = updateIsCompletedStatus(
      betGame.game_id,
      token,
      awayPoints,
      homePoints
    );
    return isUpdated;
  }
}

export async function updateIsCompletedStatus(
  id,
  token,
  awayPoints,
  homePoints
) {
  try {
    const res = await fetch(`http://localhost:3000/games/update/${id}`, {
      //Fix the route later
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ awayPoints, homePoints }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error(data.error);
      return;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteBet(id, token, amount) {
  // const bet = await fetch(`http://localhost:3000/bets/delete/${id}`, {
  //   method: "GET",
  //   headers: {
  //     accept: "application/json",
  //   },
  // });
  // const betResult = await bet.json();
  // console.log(betResult);
  // if (!bet.ok) throw Error(result?.message ?? "Something went wrong.");
  // const amount = betResult.amount;
  console.log(amount);
  const response = await fetch(`http://localhost:3000/bets/delete/${id}`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (!response.ok) throw Error(result?.message ?? "Something went wrong.");
  const creditsRes = await fetch(`http://localhost:3000/credits/return`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount,
    }),
  });
  const creditsData = await creditsRes.json();
  return result, creditsData;
}

export const getBets = async (token) => {
  const response = await fetch("http://localhost:3000/bets", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  return result;
};

// Getting game info.
export async function getGame(id, token) {
  const response = await fetch(`http://localhost:3000/games/${id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (!response.ok) throw Error(result?.message ?? "Something went wrong.");
  return result;
}

export async function getGames(bets, setBetGames, token) {
  // Getting the game data for the bet-on games.
  if (!bets) {
    return;
  } else {
    let tempArray = [];
    for (const bet of bets) {
      const gameData = await getGame(bet.game_id, token);
      const game = gameData.rows[0];
      tempArray.push(game);
    }
    setBetGames(tempArray);
  }
}

export async function placeBet(
  betTeam,
  favoredTeam,
  gameId,
  amount,
  betSpread,
  setError,
  token
) {
  const teamId = betTeam.team_id;
  const favoredTeamId = favoredTeam.team_id;
  try {
    const res = await fetch("http://localhost:3000/bets/place_bet", {
      //Fix the route later
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        gameId,
        teamId,
        favoredTeamId,
        amount,
        betSpread,
      }), //What belongs in here?
    });
    if (!res.ok) {
      const data = await res.json();
      console.error(data.error);
      setError("Placing bet failed"); // Use if this exists to check which alert to show, success or failure.
      return;
    }

    const creditsRes = await fetch(`http://localhost:3000/credits/use`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
      }),
    });
    const data = await res.json();
    const creditsData = await creditsRes.json();
    return data, creditsData;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchLiveGames(setLiveGames) {
  const response = await fetch(
    "https://api.collegefootballdata.com/scoreboard?classification=fbs",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SCOREBOARD_BEARER_TOKEN}`,
      },
    }
  );
  // console.log(response);
  const isJson = /json/.test(response.headers.get("Content-Type"));
  const result = isJson ? await response.json() : undefined;
  if (!response.ok) throw Error(result?.message ?? "Something went wrong.");
  // console.log(result);
  setLiveGames(result);
  return result;
}

export async function fetchUser(setUser) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    const data = await res.json();
    setUser(data);
  } catch (err) {
    console.error("Error loading account:", err);
  }
}

export async function updateUserScore(amount_won) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:3000/leaderboard/update/`, {
      //Fix the route later
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount_won }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error(data.error);
      return;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
