import { Routes, Route } from "react-router";

import "./App.css";
import Account from "./pages/Account";
import Bets from "./pages/Bets";
import Error404 from "./pages/Error404";
import Launch from "./pages/Launch";
import Layout from "./layout/Layout";
import Leaderboard from "./pages/Leaderboard";
import Scores from "./pages/Scores";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Add proper Layout file later */}
        <Route index element={<Scores />} />
        <Route path="/account" element={<Account />} />
        <Route path="/bets" element={<Bets />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/scores" element={<Scores />} />

        <Route path="*" element={<Error404 />} />
      </Route>

      {/* Authentication routes */}

      <Route path="/launch" element={<Launch />} />
    </Routes>
  );
}

export default App;
