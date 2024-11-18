import { useNavigate } from 'react-router-dom';
import './result-page.css';

const ResultsPage = () => {
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate('/');
    };

    return (
        <div className="resultsPage-container">
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
            <div className="resultsPage-content">
                <h1 className="resultsPage-heading">
                    RESULTS
                    <span className="resultsPage-underline"></span>
                </h1>
                <div className="resultsPage-card">
                    <div className="resultsPage-item">
                        <h2 className="resultsPage-label">Map:</h2>
                        <p className="resultsPage-value">n x N</p>
                    </div>
                    <div className="resultsPage-item">
                        <h2 className="resultsPage-label">Total clients:</h2>
                        <p className="resultsPage-value">1,000,000</p>
                    </div>
                    <div className="resultsPage-item">
                        <h2 className="resultsPage-label">Total sold tickets:</h2>
                        <p className="resultsPage-value">100,000,000,000,000,000</p>
                    </div>
                </div>
                <button className="resultsPage-button" onClick={handleReturn}>
                    RETURN
                </button>
            </div>
        </div>
    );
};

export default ResultsPage;