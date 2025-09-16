import { useState } from "react";

export default function Account() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [favoriteTeam, setFavoriteTeam] = useState("");
  const [favoriteConference, setFavoriteConference] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
  };

  return (
    <div className="account">
      <h2>Account Info</h2>

      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="text"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Favorite Team:</label>
        <select
          value={favoriteTeam}
          onChange={(e) => setFavoriteTeam(e.target.value)}
        >
          <option value="">-- Select a Team --</option>
          <option value="Ohio State Buckeyes">Ohio State Buckeyes</option>
          <option value="Tennessee Volunteers">Tennessee Volunteers</option>
          <option value="Notre Dame Fighting Irish">
            Notre Dame Fighting Irish
          </option>
          <option value="Kansas Jayhawks">Kansas Jayhawks</option>
          <option value="Miami Hurricanes">Miami Hurricanes</option>
          <option value="Michigan Wolverines">Michigan Wolverines</option>
          <option value="Georgia Bulldogs">Georgia Bulldogs</option>
        </select>
      </div>
      <div className="form-group">
        <label>Favorite Conference:</label>
        <select
          value={favoriteConference}
          onChange={(e) => setFavoriteConference(e.target.value)}
        >
          <option value="">-- Select a Conference --</option>
          <option value="SEC">SEC</option>
          <option value="Big Ten">Big Ten</option>
          <option value="ACC">ACC</option>
          <option value="Big 12">Big 12</option>
          <option value="Mid-American">Mid-American</option>
          <option value="American">American</option>
          <option value="Mountain West">Mountain West</option>
          <option value="Sun Belt">Sun Belt</option>
        </select>
      </div>

      <button className="launch-btn" onClick={save}>
        Save
      </button>

      {saved && (
        <div className="account-summary">
          <h3> Saved Info</h3>
          <p>Username: {username}</p>
          <p>Email: {email}</p>
          <p>Favorite Team: {favoriteTeam}</p>
          <p>Favorite Conference: {favoriteConference}</p>
        </div>
      )}
    </div>
  );
}
