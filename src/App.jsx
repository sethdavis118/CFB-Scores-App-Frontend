import { Routes, Route } from "react-router";

import "./App.css";
import Account from "./pages/Account";
import Bets from "./pages/Bets";
import Error404 from "./pages/Error404";
import Launch from "./pages/Launch";
import Layout from "./layout/Layout";
import Leaderboard from "./pages/Leaderboard";
import Scores from "./pages/Scores";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Add proper Layout file later */}
        <Route index element={<Scores />}></Route>
        <Route path="/account" element={<Account />}></Route>
        <Route path="/bets" element={<Bets />}></Route>
        <Route path="/leaderboard" element={<Leaderboard />}></Route>
        <Route path="/scores" element={<Scores />}></Route>
        <Route path="*" element={<Error404 />}></Route>
      </Route>
      <Route path="/launch" element={<Launch />}></Route>
    </Routes>
  );
}

export default App;
