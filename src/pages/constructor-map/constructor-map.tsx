import { FC, useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./constructor-map.css";
import DeskImage from '../../assets/information-desk 2.png';
import EntranceImage from '../../assets/Entrance.png';
import { useLocation } from "react-router-dom";
import LogList from "../../components/log-list/log-list";
import StandingManImage from '../../assets/standing-up-man- 4.png'
import { Socket, connect } from "socket.io-client";

const DRAG_TYPES = {
    DESK: "desk",
    RESERVED_DESK: "reserved_desk",
    ENTRANCE: "entrance",
};

const SOCKET_URL = "http://localhost:8082";

// const socket = io(SOCKET_URL);

const DraggableItem = ({ id, type, label, onDragStart, count }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type,
        item: () => {
            if (count > 0) {
                onDragStart(type);
                return { id, type };
            }
            return null;
        },
        canDrag: () => count > 0,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        end: () => onDragStart(""),
    }));

    return (
        <div className="draggable-item-container">
            <div
                ref={drag}
                className={`draggable-item ${count === 0 ? 'disabled' : ''}`}
                style={{
                    opacity: isDragging ? 0.5 : count > 0 ? 1 : 0.5,
                    cursor: count > 0 ? "move" : "not-allowed",
                    pointerEvents: count > 0 ? "auto" : "none",
                }}
            >
                {label}
                <span className="item-counter">{count}</span>
            </div>
        </div>
    );
};

const GridCell = ({ currentDragType, x, onDrop, item, className, placedItem }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: [DRAG_TYPES.DESK, DRAG_TYPES.RESERVED_DESK, DRAG_TYPES.ENTRANCE],
        drop: (draggedItem) => {
            if (draggedItem) {
                onDrop(draggedItem, x);
            }
        },
        collect: (monitor) => {
            return ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop() && monitor.getItem() !== null && monitor.getItem().type === currentDragType,
            })
        },
    }));


    return (
        <div
            ref={drop}
            className={`grid-cell ${isOver ? "hovered" : ""} ${canDrop ? "droppable" : ""} ${className}`}
        >
            {item && (
                <img
                    src={item.type === DRAG_TYPES.DESK || item.type === DRAG_TYPES.RESERVED_DESK ? DeskImage : EntranceImage}
                    alt={item.type}
                />
            )}
            {placedItem && <img src={StandingManImage} alt="Standing Man" className="standing-man" />}
        </div>
    );
};

const RedRectanglesRow = ({ currentDragType, dragType, columnCount, availableColumns, onDrop }: {
    currentDragType: string,
    dragType: string | string[],
    columnCount: number;
    availableColumns: number[];
    onDrop: (type: string) => void;
}) => {
    const [grid, setGrid] = useState(Array.from({ length: 20 }, () => Array(20).fill(null)));

    const handleDrop = (item, x) => {
        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((row) => [...row]);
            newGrid[0][x] = item;
            return newGrid;
        });
        onDrop(item.type);
    };

    return (
        <>
            <div className="desk-grid">
                {grid[0].map((cell, x) => {
                    const isAvailable = availableColumns.includes(x);
                    return isAvailable ? (
                        <GridCell
                            currentDragType={currentDragType}
                            key={`${x}`}
                            x={x}
                            onDrop={handleDrop}
                            item={cell}
                            className={`desk-grid-cell`}
                        />
                    ) : (
                        <div key={`${x}`} className="unavailable-grid-cell"></div>
                    );
                })}
            </div>
        </>
    );
};

const Timer = () => {
    const [time, setTime] = useState(() => {
        const now = new Date();
        return {
            hours: now.getHours(),
            minutes: now.getMinutes(),
            seconds: now.getSeconds(),
        };
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTime({
                hours: now.getHours(),
                minutes: now.getMinutes(),
                seconds: now.getSeconds(),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (unit) => String(unit).padStart(2, "0");

    return (
        <div className="timer">
            <span className="timer-time">
                {formatTime(time.hours)}:{formatTime(time.minutes)}:
                {formatTime(time.seconds)}
            </span>
        </div>
    );
};


export const ConstructorMap = () => {
    const [currentDragType, setCurrentDragType] = useState("");
    const location = useLocation();
    const [manPositions, setManPositions] = useState([
        // { x: 3, y: 2 },
        // { x: 5, y: 6 },
    ]);
    const [socketLogs, setSocketLogs] = useState<string[]>([]);

    const mapWidth = parseInt(location.state.settings.mapWidth);
    const mapHeight = parseInt(location.state.settings.mapHeight);

    const [isSimulationStarted, setIsSimulationStarted] = useState(false)

    const [itemCounts, setItemCounts] = useState({
        [DRAG_TYPES.DESK]: parseInt(location.state.settings.desks),
        [DRAG_TYPES.ENTRANCE]: parseInt(location.state.settings.entrances),
        [DRAG_TYPES.RESERVED_DESK]: 3,
    });
    const [isLogsShown, setIsLogShown] = useState<boolean>(false)
    const [socket, setSocket] = useState<Socket | null>(null);

    console.log('render')

    useEffect(() => {
        const socketInstance = connect(SOCKET_URL);

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('connect')
        });

        // Event Listeners
        const handleNewClient = (data: any) => {
            console.log("New client event received:", data);
            setSocketLogs((prev) => [...prev, `New client: ${JSON.stringify(data)}`]);
        };

        const handleCashDesk = (data: any) => {
            console.log("Cash desk event received:", data);
            setSocketLogs((prev) => [...prev, `Cash desk update: ${JSON.stringify(data)}`]);
        };

        const handleDisconnect = (reason: string) => {
            console.log("Socket disconnected:", reason);
            setSocketLogs((prev) => [...prev, `Disconnected: ${reason}`]);
        };

        socketInstance.on("new_client", handleNewClient);
        socketInstance.on("cash_desk", handleCashDesk);
        socketInstance.on("disconnect", handleDisconnect);

        return () => {
            if (socketInstance) {
                socketInstance.off("new_client", handleNewClient);
                socketInstance.off("cash_desk", handleCashDesk);
                socketInstance.off("disconnect", handleDisconnect);
                socketInstance.disconnect();
            }
        };
    }, []);

    const startSimulation = async () => {
        try {
            
            if (!isSimulationStarted) {
                const response = await fetch('http://localhost:8080/simulation/trainStation', {
                    method: "POST"
                });
                const data = await response.json();
                console.log("Simulation API response:", data);
                setSocketLogs(prev => [...prev, `API Response: ${JSON.stringify(data)}`]);
            }
            if (socket) {
                console.log("Emitting start_simulation event");
                socket.emit("start_simulation");
                setSocketLogs(prev => [...prev, "Simulation started"]);
                setIsSimulationStarted(true);
            }

        } catch (error) {
            console.error("Error in startSimulation:", error);
            // setSocketLogs(prev => [...prev, `Error starting simulation: ${error.message}`]);
        }
    };

    const stopSimulation = () => {
        // if (socket) {
        //     console.log("Emitting stop_simulation event");
        //     socket.emit("stop_simulation");
        //     setSocketLogs(prev => [...prev, "Simulation stopped"]);
        //     setIsSimulationStarted(false);
        // }
    };

    const [grid, setGrid] = useState(
        Array.from({ length: mapWidth }, () => Array(mapHeight).fill(null))
    );

    useEffect(() => {
        document.documentElement.style.setProperty("--map-width", `${mapWidth}`);
        document.documentElement.style.setProperty("--map-height", `${mapWidth}`);
    }, [mapWidth, mapHeight]);

    const generateAvailableColumns = (width: number, skip: number[]) => {
        return Array.from({ length: width }, (_, index) =>
            skip.includes(index) ? null : index
        ).filter((x) => x !== null);
    };

    const availableColumns = generateAvailableColumns(mapWidth, [5, 6]);
    const availableEntranceColumns = generateAvailableColumns(mapWidth, [5, 6]);

    const handleDrop = (itemType) => {
        setItemCounts((prev) => ({
            ...prev,
            [itemType]: Math.max(0, prev[itemType] - 1),
        }));
    };

    const showLogs = () => {
        setIsLogShown(prev => !prev)
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="map-container">
                <header className="map-header">
                    {isSimulationStarted ?
                        <Timer /> :
                        <h1 className="map-title">Construct your map</h1>
                    }
                    {!isSimulationStarted && <div className="controls">
                        <DraggableItem
                            id={1}
                            type={DRAG_TYPES.DESK}
                            label={<img src={DeskImage} />}
                            onDragStart={setCurrentDragType}
                            count={itemCounts[DRAG_TYPES.DESK]}
                        />
                        <DraggableItem
                            id={2}
                            type={DRAG_TYPES.RESERVED_DESK}
                            label={<img src={DeskImage} />}
                            onDragStart={setCurrentDragType}
                            count={itemCounts[DRAG_TYPES.RESERVED_DESK]}
                        />
                        <DraggableItem
                            id={3}
                            type={DRAG_TYPES.ENTRANCE}
                            label={<img src={EntranceImage} />}
                            onDragStart={setCurrentDragType}
                            count={itemCounts[DRAG_TYPES.ENTRANCE]}
                        />
                    </div>}
                    <button className="start-button" onClick={isSimulationStarted ? stopSimulation : startSimulation}>
                        {isSimulationStarted ? 'Stop' : 'Start'} Simulation
                    </button>
                    <button className="start-button" onClick={showLogs}>Show Logs</button>
                    {isLogsShown && (
                        <div className="log-list">
                            <LogList logs={socketLogs} />
                        </div>
                    )}
                </header>
                <RedRectanglesRow
                    currentDragType={currentDragType}
                    dragType={[DRAG_TYPES.DESK, DRAG_TYPES.RESERVED_DESK]}
                    columnCount={20}
                    availableColumns={availableColumns}
                    onDrop={handleDrop}
                />
                <div className="grid-container">
                    {grid.map((row, y) =>
                        row.map((cell, x) => {
                            const isManHere = manPositions.some((pos) => pos.x === x && pos.y === y);
                            return (
                                <GridCell
                                    key={`${y}-${x}`}
                                    x={x}
                                    y={y}
                                    currentDragType={currentDragType}
                                    onDrop={handleDrop}
                                    item={cell}
                                    placedItem={isManHere}
                                    className="grid-cell"
                                />
                            );
                        })
                    )}
                </div>
                <RedRectanglesRow
                    currentDragType={currentDragType}
                    dragType={DRAG_TYPES.ENTRANCE}
                    columnCount={20}
                    availableColumns={availableEntranceColumns}
                    onDrop={handleDrop}
                />
            </div>
        </DndProvider>
    );
};

export default ConstructorMap;