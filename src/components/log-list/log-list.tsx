import React, { useRef, useEffect } from 'react';
import './log-list.css';

interface LogEntry {
  time: string;
  passengerNumber: number;
  deskNumber: number;
}

interface LoggingProps {
  logs: LogEntry[];
}

const LogList: React.FC<LoggingProps> = ({ logs }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="logging-container">
      <div className="logging-scroll-container" ref={scrollContainerRef}>
        {logs.map((log, index) => (
          <div key={index} className="log-entry">
            <div className="log-time">{log.time}</div>
            <div className="log-message">
              Passenger {log.passengerNumber} have purchased a ticket at
              desk {log.deskNumber}
            </div>
          </div>
        ))}
        
        <div className="log-entry log-ellipsis">...</div>
        
        <div className="log-entry">
          <div className="log-time">NN:NN:NN</div>
          <div className="log-message">
            Passenger N have purchased a ticket at
            reserve desk N
          </div>
        </div>
      </div>
      <div className="scroll-bar">
        <div className="scroll-thumb"></div>
      </div>
    </div>
  );
};

export default LogList;