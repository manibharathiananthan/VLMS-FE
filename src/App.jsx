import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Register from "./Components/Register";
import ServiceHistory from "./Components/ServiceHistory";
import "./App.css";

function App() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/service-history"
        element={<ServiceHistory user={user} />}
      />

    </Routes>
  );
}

export default App;