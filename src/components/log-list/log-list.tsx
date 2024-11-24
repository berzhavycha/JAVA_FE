import React, { useRef, useEffect } from 'react';
import './log-list.css';

interface LogEntry {
  clientId: number;
  cashDeskId: number;
  ticketCount: number;
  startTimeMs: number;
  endTimeMs: number;
}

interface LoggingProps {
  logs: LogEntry[];
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

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
            <div className="log-time">{formatTime(log.startTimeMs)}</div>
            <div className="log-message">
              Passenger {log.clientId} has purchased {log.ticketCount} ticket(s) at desk {log.cashDeskId}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogList;
