import "./App.css";
import { Routes, Route } from "react-router-dom"; // Import Routes, Route
import Home from "./pages/Home";
import OpenPRs from "./pages/OpenPRs";
import ClosedPRs from "./pages/ClosedPRs";
import DashBoard from "./pages/DashBoard";
import Auth from "./pages/Auth";
import MainLayout from "./pages/MainLayout";
import AuthLayout from "./pages/AuthLayout";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/auth" element={<Auth />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/open-prs" element={<OpenPRs />} />
        <Route path="/closed-prs" element={<ClosedPRs />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Route>
    </Routes>
  );
}

export default App;
