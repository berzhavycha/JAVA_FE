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

const formatTime = (milliseconds: number) => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  const pad = (num: number) => String(num).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
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
        {logs.length === 0 ? (
          <div className="log-entry log-placeholder">
            <div className="log-time">--:--:--</div>
            <div className="log-message">Logs are empty</div>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="log-entry">
              <div className="log-time">{formatTime(log.startTimeMs)}</div>
              <span>-</span>
              <div className="log-time">{formatTime(log.endTimeMs)}</div>
              <div className="log-message">
                Passenger {log.clientId} has purchased {log.ticketCount} ticket(s) at desk {log.cashDeskId}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogList;
