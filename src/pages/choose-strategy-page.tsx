import React, { useState } from 'react';

type Strategy = {
  id: number;
  title: string;
  description: string;
  chosen: boolean;
};

const strategies: Strategy[] = [
  { id: 1, title: 'STRATEGY 1', description: 'Text', chosen: true },
  { id: 2, title: 'STRATEGY 2', description: 'Text', chosen: false },
  { id: 3, title: 'STRATEGY 3', description: 'Text', chosen: false },
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
    <div className='gloval-strategy-body'>
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
            <h2>{strategy.title}</h2>
            <p>{strategy.description}</p>
            <button className="choose-button">
              {strategy.id === selectedStrategy ? 'Chosen ✔' : 'Choose ✖'}
            </button>
          </div>
        ))}
      </div>

      <div className="half-circle">
        <div className="circle-content">
          <h1 className="title">TICKETS SIMULATOR</h1>
          <p className="subtitle">SETTINGS</p>
          <h2 className="global-title">
            GLOBAL <span className="strategy-highlight">STRATEGY</span>
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
