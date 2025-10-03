import { Routes, Route, Navigate } from "react-router";
import RequireAuth from "./components/RequireAuth.jsx";

import "./App.css";
import Account from "./pages/Account.jsx";
import Bets from "./pages/Bets.jsx";
import Error404 from "./pages/Error404.jsx";
import Launch from "./pages/Launch.jsx";
import Layout from "./layout/Layout.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Scores from "./pages/Scores.jsx";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import EditUser from "./pages/EditUser.jsx";

//Wrapping </LoginForm /> and <RegistrationForm /> with RequireAuth causes problems between the two,
//so going to make a couple of these routes in a public category.
function App() {
  return (
    <Routes>
      {`public routes`}
      <Route path="/" element={<Layout />}>
        <Route index element={<Scores />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/*Add proper Layout file later - what does this comment mean?-Mike*/}
        {`'private routes'`}

        <Route
          path="/account"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />
        <Route
          path="/account/edit"
          element={
            <RequireAuth>
              <EditUser />
            </RequireAuth>
          }
        />

        <Route
          path="/bets"
          element={
            <RequireAuth>
              <Bets />
            </RequireAuth>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <RequireAuth>
              <Leaderboard />
            </RequireAuth>
          }
        />
        {/* Redirect old path to new path */}
        <Route
          path="/edit-user"
          element={<Navigate to="/account/edit" replace />}
        />

        <Route path="*" element={<Error404 />} />
      </Route>

      {/* Authentication routes */}

      <Route path="/launch" element={<Launch />} />
    </Routes>
  );
}

export default App;
