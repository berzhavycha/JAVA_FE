import { useNavigate } from 'react-router-dom';
import './result-page.css';

const ResultsPage = () => {
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate('/');
    };

    return (
        <div className="results-container">
            <div className="background-pattern">
                <div className="background-text">TOKYO-KYIV BEIJING-SHANGHAI</div>
                <div className="background-text">PARIS-BERLIN KYIV-LVIV</div>
                <div className="background-text">TOKYO-KYIV BEIJING-SHANGHAI</div>
                <div className="background-text">PARIS-BERLIN KYIV-LVIV</div>
                <div className="background-text">TOKYO-KYIV BEIJING-SHANGHAI</div>
                <div className="background-text">PARIS-BERLIN KYIV-LVIV</div>
                <div className="background-text">TOKYO-KYIV BEIJING-SHANGHAI</div>
                <div className="background-text">PARIS-BERLIN KYIV-LVIV</div>
            </div>
            <div className="results-content">
                <h1 className="results-heading">
                    RESULTS
                    <span className="underline"></span>
                </h1>
                <div className="results-card">
                    <div className="result-item">
                        <h2 className="result-label">Map:</h2>
                        <p className="result-value">n x N</p>
                    </div>
                    <div className="result-item">
                        <h2 className="result-label">Total clients:</h2>
                        <p className="result-value">1,000,000</p>
                    </div>
                    <div className="result-item">
                        <h2 className="result-label">Total sold tickets:</h2>
                        <p className="result-value">100,000,000,000,000,000</p>
                    </div>
                </div>
                <button className="return-button" onClick={handleReturn}>
                    RETURN
                </button>
            </div>
        </div>
    );
};

export default ResultsPage;