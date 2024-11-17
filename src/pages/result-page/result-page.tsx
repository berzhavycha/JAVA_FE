import { useNavigate } from 'react-router-dom';
import './result-page.css';

const ResultsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="results-container">
      <div className="background-text">
        TOKYO-KY BEIJING SHA PARIS BERLIN 524 KYV-LVI
      </div>
      
      <div className="results-content">
        <h1 className="results-heading">RESULTS</h1>
        
        <div className="results-card">
          <div className="result-item">
            <h2 className="result-label">Map:</h2>
            <p className="result-value">n x N</p>
          </div>
          
          <div className="result-item">
            <h2 className="result-label">Total clients:</h2>
            <p className="result-value">1000000</p>
          </div>
          
          <div className="result-item">
            <h2 className="result-label">Total sold tickets:</h2>
            <p className="result-value">100000000000000000</p>
          </div>
        </div>
        
        <button 
          className="return-button"
          onClick={() => navigate(-1)}
        >
          RETURN
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;