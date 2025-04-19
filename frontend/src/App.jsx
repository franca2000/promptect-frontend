import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import LoginForm from "./LoginForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<LoginForm />} /> {/* reutilizamos el mismo */}
      </Routes>
    </Router>
  );
}

export default App;

