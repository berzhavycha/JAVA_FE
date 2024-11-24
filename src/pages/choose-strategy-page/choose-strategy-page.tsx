import React, { useState } from 'react';
import './choose-strategy-page.css';
import Image1 from '../../assets/Strategy1.jpg'
import Image2 from '../../assets/Strategy2.jpg'
import Image3 from '../../assets/Strategy3.jpg'
import Image4 from '../../assets/train-ticket.png'
import { useLocation, useNavigate } from 'react-router-dom';

type Strategy = {
  id: number;
  title: string;
  description: string;
  image: React.ReactNode;
  chosen: boolean;
};

const strategies: Strategy[] = [
  { id: 1, title: 'Increasing', description: 'Description for Increasing Strategy', image: <img src={Image3}/>, chosen: true },
  { id: 2, title: 'Equal', description: 'Description for Equal Strategy',image: <img src={Image1}/>, chosen: false },
  { id: 3, title: 'Random', description: 'Description for Random Strategy',image: <img src={Image2}/>, chosen: false },
];

const GlobalStrategy: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation()

  const [selectedStrategy, setSelectedStrategy] = useState<string>('Increasing');

  const handleChoose = (title: string) => {
    setSelectedStrategy(title);
  };

  const handleBack= () => {
    navigate("/global-strategy-form");
  };
  
  const handleSave = () => {
    navigate("/constructor-map", {
      state: {
        ...location.state,
        selectedStrategy
      }
    })
  };

  return (
    <div className="gloval-strategy-body">
      <div className="global-strategy-container">
        <div className="back-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={handleBack}
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </div>

        <div className="strategies-row">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`strategy-card ${strategy.title === selectedStrategy ? 'chosen' : ''}`}
              onClick={() => handleChoose(strategy.title)}
            >
              <h2 className="csp-strategy-title">{strategy.title}</h2>
              {strategy.image}
              <p className="strategy-description">{strategy.description}</p>
              <button className="choose-button">
                {strategy.title === selectedStrategy ? 'Chosen ✔️' : 'Choose ✖️'}
              </button>
            </div>
          ))}
        </div>

        <div className="half-circle">
        
          <div className="circle-content">
          <img className='choose-title' src={Image4}/>
            <h1 className="choose-title">TICKETS SIMULATOR</h1>
            <p className="csp-subtitle">SETTINGS</p>
            <h2 className="csp-global-title">
  GLOBAL <br />
  <p className="strategy-highlight">STRATEGY</p>
</h2>
          </div>
          <button className="csp-save-button" onClick={handleSave}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalStrategy;
