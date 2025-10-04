import { useEffect, useState } from "react";
import { editAccount, fetchUser } from "../api/ApiFunctions";
import { getTeam } from "../api/ApiFunctions";
import useQuery from "../api/useQuery";
import { Link } from "react-router";

export default function EditForm() {
  const [user, setUser] = useState();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [favoriteTeam, setFavoriteTeam] = useState("");
  const [favoriteConf, setFavoriteConf] = useState("");
  const [teamText, setTeamText] = useState("");

  const token = localStorage.getItem("token");

  // fetch teams
  const { data: teams = [] } = useQuery("/teams");
  // fetch conferences
  const { data: conferences = [] } = useQuery("/teams/conferences");
  // teamText = getTeam(user?.favorite_team, token);
  // setTeamText(tempText);

  const teamTextFunc = async () => {
    if (user) {
      const tempTeam = await getTeam(user?.favorite_team, token);
      console.log(tempTeam);
      setTeamText(tempTeam.school + " " + tempTeam.mascot);
    }
  };

  useEffect(() => {
    fetchUser(setUser);
  }, []);
  useEffect(() => {
    setUsername(user?.username);
    setEmail(user?.email);
    setFavoriteTeam(user?.favoriteTeam);
    setFavoriteConf(user?.favoriteConf);
    teamTextFunc();
  }, [user]);

  console.log(user);

  return (
    <div className="register-form">
      <h2>Edit Account</h2>
      {/* {error && <p>{error}</p>} */}
      <form>
        {" "}
        {/*onSubmit={handleRegister}*/}
        <div>
          <label>Username:</label>
          <input
            // I see errors here about a changing component, but it doesn't seem to be causing any problem so I'll leave it.
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {/* <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div> */}
        <div>
          <label>Favorite Team:</label>
          <select
            value={favoriteTeam}
            onChange={(e) => setFavoriteTeam(e.target.value)}
          >
            <option value="">{teamText}</option>
            {teams.map((team) => (
              <option key={team.id} value={team.team_id}>
                {team.school} {team.mascot}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Favorite Conference:</label>
          <select
            value={favoriteConf}
            onChange={(e) => setFavoriteConf(e.target.value)}
          >
            <option value="">{user?.favorite_conference}</option>
            {conferences.map((conf, index) => (
              <option key={index} value={conf}>
                {conf}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            const payload = { username, email, favoriteTeam, favoriteConf };
            console.log("Payload", payload);
            editAccount(token, payload);
          }}
        >
          Edit Account
        </button>{" "}
        {/* Add parameters to function */}
      </form>
      <Link to="/account">Cancel</Link>
    </div>
  );
}
