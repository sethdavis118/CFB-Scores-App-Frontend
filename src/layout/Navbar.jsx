import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <>
      <NavLink to="/">Scores</NavLink>
      <NavLink to="/bets">Bets</NavLink>
      <NavLink to="/leaderboard">Leaderboard</NavLink>
      <NavLink to="/account">Account</NavLink>
    </>
  );
}
