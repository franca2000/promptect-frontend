import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import LoginForm from "./LoginForm"; // si ya lo tienes
// import RegisterForm from "./RegisterForm"; // si lo generamos después

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginForm />} />
        {/* <Route path="/register" element={<RegisterForm />} /> */}
      </Routes>
    </Router>
  );
}

export default App;


