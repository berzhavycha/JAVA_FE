import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './result-page.css';

interface ResultDto {
    totalClients: number;
    totalTickets: number;
}

const ResultsPage = () => {
    const [result, setResult] = useState<ResultDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch('http://localhost:8080/order/result');
                if (!response.ok) {
                    throw new Error(`Failed to fetch results: ${response.statusText}`);
                }
                const data: ResultDto = await response.json();
                setResult(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const handleReturn = () => {
        navigate('/');
    };


    if (loading) {
        return <div className="resultsPage-container">Loading...</div>;
    }

    if (error) {
        return <div className="resultsPage-container">Error: {error}</div>;
    }


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
                        <h2 className="resultsPage-label">Total clients:</h2>
                        <p className="resultsPage-value">{result?.totalClients.toLocaleString()}</p>
                    </div>
                    <div className="resultsPage-item">
                        <h2 className="resultsPage-label">Total sold tickets:</h2>
                        <p className="resultsPage-value">{result?.totalTickets.toLocaleString()}</p>
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
