import React, { useState } from 'react';
import './choose-strategy-page.css';
import Image1 from '../../assets/Strategy1.jpg'
import Image2 from '../../assets/Strategy2.jpg'
import Image3 from '../../assets/Strategy3.jpg'
type Strategy = {
  id: number;
  title: string;
  description: string;
  image: React.ReactNode;
  chosen: boolean;
};

const strategies: Strategy[] = [
  { id: 1, title: 'Strategy 1', description: 'Description for Strategy 1', image: <img src={Image1}/>, chosen: true },
  { id: 2, title: 'Strategy 2', description: 'Description for Strategy 2',image: <img src={Image2}/>, chosen: false },
  { id: 3, title: 'Strategy 3', description: 'Description for Strategy 3',image: <img src={Image3}/>, chosen: false },
];

const GlobalStrategy: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<number>(1);

  const handleChoose = (id: number) => {
    setSelectedStrategy(id);
  };

  const handleSave = () => {
    alert(`Strategy ${selectedStrategy} has been saved!`);
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
            onClick={() => alert('Go back!')}
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </div>

        <div className="strategies-row">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`strategy-card ${strategy.id === selectedStrategy ? 'chosen' : ''}`}
              onClick={() => handleChoose(strategy.id)}
            >
              <h2 className="strategy-title">{strategy.title}</h2>
              {strategy.image}
              <p className="strategy-description">{strategy.description}</p>
              <button className="choose-button">
                {strategy.id === selectedStrategy ? 'Chosen ✔️' : 'Choose ✖️'}
              </button>
            </div>
          ))}
        </div>

        <div className="half-circle">
          <div className="circle-content">
            <h1 className="choose-title">TICKETS SIMULATOR</h1>
            <p className="subtitle">SETTINGS</p>
            <h2 className="global-title">
  GLOBAL <br />
  <p className="strategy-highlight">STRATEGY</p>
</h2>
          </div>
          <button className="save-button" onClick={handleSave}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalStrategy;
