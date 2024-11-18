import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IntroPage } from "./pages/intro-page/intro-page";
import { GlobalStrategyForm } from "./pages/global-strategy-form/global-strategy-form";
import ResultsPage from "./pages/result-page/result-page";
import GlobalStrategy from "./pages/choose-strategy-page/choose-strategy-page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/global-strategy-form" element={<GlobalStrategyForm />} />
        <Route path="/choose-strategy-page" element={<GlobalStrategy/>} />
        <Route path="/result-page" element={<ResultsPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
