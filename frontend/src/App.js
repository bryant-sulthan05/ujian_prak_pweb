import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Register from "./views/Register";
import Answer from "./views/Answer";
import Profile from "./views/Profile";
import ForgotPass from "./views/Components/ForgotPass";
import UsersProfile from "./views/UsersProfile";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Answers/:id" element={<Answer />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/ForgotPass" element={<ForgotPass />} />
          <Route path="/Profile/:id" element={<UsersProfile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
