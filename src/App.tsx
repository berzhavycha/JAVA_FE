import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IntroPage } from "./pages/intro-page";
import { GlobalStrategyForm } from "./pages/global-strategy-form";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/global-strategy-form" element={<GlobalStrategyForm />} />
      </Routes>
    </Router>
  );
}

export default App;
