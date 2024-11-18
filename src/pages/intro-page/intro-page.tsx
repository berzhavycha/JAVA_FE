import { useNavigate } from 'react-router-dom';
import { FC, } from "react";
import TicketImage from '../../assets/train-ticket.png'
import './intro-page.css'

export const IntroPage: FC = () => {
    const navigate = useNavigate();
    
    const handleStart = () => {
        navigate('/global-strategy-form');
    };

    return (
        <div className="simulator-container">
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

            <div className="content">
                <h1 className="title">Tickets Simulator</h1>
                <div>
                    <img src={TicketImage} />
                </div>
                <button className="start-button" onClick={handleStart}>
                    START
                </button>
            </div>
        </div>
    )
}