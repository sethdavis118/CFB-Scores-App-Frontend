import { useEffect, useState, useTransition } from "react";
import useQuery from "../api/useQuery";

// I'm going to pass in a game object that will include the team names, the score, and time remaining.
// I may also eventually pass in a bets object that will include relevant information for that data.
export default function Scorecard({ game }) {
  // console.log(game);
  // console.log(game.home_team_id, game.away_team_id);
  const { data: home_team_data } = useQuery(
    `/teams/team_id/${game.home_team_id}`
  );
  const { data: away_team_data } = useQuery(
    `/teams/team_id/${game.away_team_id}`
  );
  const [appears, setAppears] = useState(false);
  const [homeName, setHomeName] = useState();
  const [awayName, setAwayName] = useState();
  const [homeAbbreviation, setHomeAbbreviation] = useState();
  const [awayAbbreviation, setAwayAbbreviation] = useState();
  const [homePoints, setHomePoints] = useState();
  const [awayPoints, setAwayPoints] = useState();
  const [homeColor, setHomeColor] = useState();
  const [awayColor, setAwayColor] = useState();
  const [homeLogo, setHomeLogo] = useState();
  const [awayLogo, setAwayLogo] = useState();
  const [isFinal, setIsFinal] = useState();

  const [showPopup, setShowPopup] = useState(false);
  const [betTeam, setBetTeam] = useState();

  useEffect(() => {
    if (
      home_team_data &&
      away_team_data &&
      Object.keys(home_team_data).length > 0 &&
      Object.keys(away_team_data).length > 0
    ) {
      setHomeName(home_team_data.school);
      setAwayName(away_team_data.school);
      setHomeAbbreviation(home_team_data.abbreviation);
      setAwayAbbreviation(away_team_data.abbreviation);
      setHomePoints(game.home_points);
      setAwayPoints(game.away_points);
      setHomeColor(home_team_data.color);
      setAwayColor(away_team_data.color);
      setHomeLogo(home_team_data.logos[0]);
      setAwayLogo(away_team_data.logos[0]);
      setIsFinal(game.completed);
      console.log(homeLogo);
      setAppears(true);
    }
  }, [home_team_data, away_team_data]);

  // const { home_points, away_points, time, quarter, completed } = game;
  // const { school: homeSchool, color: homeColor } = home_team_data;
  // const { school: awaySchool, color: awayColor } = away_team_data;
  // // In reality, we'll likely fetch the color using a query from the team name, but for now I'm hard-coding it.

  // let quarterStr;
  // if (quarter === 1) {
  //   quarterStr = "1st";
  // } else if (quarter === 2) {
  //   quarterStr = "2nd";
  // } else if (quarter === 3) {
  //   quarterStr = "3rd";
  // } else if (quarter === 4) {
  //   quarterStr = "4th";
  // } else if (completed) {
  //   quarterStr = "Final";
  // }

  // console.log(home_points);
  return (
    <div>
      {appears && (
        <li className="scorecard">
          <div className="scorecard-data">
            <div className="scorecard-away-points-data">
              <div className="scorecard-logo-name">
                <img
                  src={awayLogo}
                  alt={`${awayName}'s Logo`}
                  className="scorecard-logo"
                />
                <h4 style={{ color: awayColor }}>{awayName}</h4>
              </div>
              <h2>{awayPoints}</h2>
            </div>
            <div className="scorecard-home-points-data">
              <div className="scorecard-logo-name">
                <img
                  src={homeLogo}
                  alt={`${homeName}'s Logo`}
                  className="scorecard-logo"
                />
                <h4 style={{ color: homeColor }}>{homeName}</h4>
              </div>
              <h2>{homePoints}</h2>
            </div>
          </div>
          <div className="scorecard-interaction">
            <button
              // The placeBet onClick doesn't work yet.
              onClick={() => {
                setShowPopup(!showPopup);
                setBetTeam(away_team_data);
              }}
              className="scorecard-bet-btn"
              style={{ background: awayColor }}
            >
              Bet {awayAbbreviation}
            </button>
            <button
              // The placeBet onClick doesn't work yet.
              onClick={() => {
                setShowPopup(!showPopup);
                setBetTeam(home_team_data);
              }}
              className="scorecard-bet-btn"
              style={{ background: homeColor }}
            >
              Bet {homeAbbreviation}
            </button>
          </div>
          {showPopup && (
            <>
              <img
                src={betTeam.logos[0]}
                alt={`${betTeam}'s logo`}
                className="bet-team-img"
              ></img>
              <button onClick={() => setShowPopup(false)}>Dismiss popup</button>
            </>
          )}
          {/* <div className="scorecard-clock">
            <h4 className="scorecard-clock-item">{isFinal}</h4>
            <p className="scorecard-clock-item">{time}</p>
          </div>
          <p>{game.game?.betTeam}</p>
          <p>{game.game?.betLine}</p> */}
        </li>
      )}
    </div>
  );
}
