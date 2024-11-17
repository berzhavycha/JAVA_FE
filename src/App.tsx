import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IntroPage } from "./pages/intro-page/intro-page";
import { GlobalStrategyForm } from "./pages/global-strategy-form/global-strategy-form";
import GlobalStrategy from "./pages/choose-strategy-page/choose-strategy-page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/global-strategy-form" element={<GlobalStrategyForm />} />
        <Route path="/choose-strategy-page" element={<GlobalStrategy/>} />
      </Routes>
    </Router>
  );
}

export default App;
