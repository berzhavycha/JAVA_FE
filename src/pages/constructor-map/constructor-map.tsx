import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./constructor-map.css";
import DeskImage from '../../assets/information-desk 2.png';
import EntranceImage from '../../assets/Entrance.png';
import { useLocation, useNavigate } from "react-router-dom";
import LogList from "../../components/log-list/log-list";
import { Socket, connect } from "socket.io-client";
import { DraggableItem } from "./components/draggable-item";
import { DRAG_TYPES, GridCell } from "./components/grid-cell";
import { RedRectanglesRow } from "./components/red-rectangle-row";
import { Timer } from "./components/timer";




const SOCKET_URL = "http://localhost:8082";

type Client = {
    id: number;
    position: {
        x: number;
        y: number;
    },
    ticketNumber: number;
    priority: number;
    type: 'string'
}

type CashDesk = {
    id: number;
    position: {
        x: number;
        y: number;
    }
    clientsQueue: Client[];
    backup: boolean;
    broken: boolean;
}

type Entrance = {
    position: {
        x: number;
        y: number;
    }
}

type BuildingMap = {
    sizeX: number;
    sizeY: number;
}

type TrainSimulationResponse = {
    cashDesks: CashDesk[],
    entrances: Entrance[],
    buildingMap: BuildingMap;
    maxPeopleCount: number;
}

export const ConstructorMap = () => {
    const [currentDragType, setCurrentDragType] = useState("");
    const location = useLocation();
    const [trainSimulation, setTrainSimulation] = useState<TrainSimulationResponse | null>(null);
    const [clients, setClients] = useState<Client[]>([])
    const [logs, setLogs] = useState<any[]>([]);

    const mapWidth = parseInt(location.state.settings.mapWidth);
    const mapHeight = parseInt(location.state.settings.mapHeight);

    const [isSimulationStarted, setIsSimulationStarted] = useState(false)

    const [itemCounts, setItemCounts] = useState({
        [DRAG_TYPES.DESK]: parseInt(location.state.settings.desks),
        [DRAG_TYPES.ENTRANCE]: parseInt(location.state.settings.entrances),
        [DRAG_TYPES.RESERVED_DESK]: 1,
    });
    const [isLogsShown, setIsLogShown] = useState<boolean>(false)
    const [socket, setSocket] = useState<Socket | null>(null);

    const [deskPositions, setDeskPositions] = useState<{ x: number; y: number }[]>([]);
    const [entrancePositions, setEntrancePositions] = useState<{ x: number; y: number }[]>([]);
    const [reserveDeskPosition, setReserveDeskPosition] = useState<{ x: number; y: number } | null>(null);

    console.log(location.state.settings)
    const navigate = useNavigate()

    useEffect(() => {
        if (trainSimulation) {
            const updatedClients = trainSimulation.cashDesks.flatMap(desk =>
                desk.clientsQueue.map((client, index) => ({
                    ...client,
                    position: {
                        x: desk.position.x,
                        y: desk.position.y + index,
                    },
                }))
            );
            setClients(updatedClients);
        }
    }, [trainSimulation]);

    useEffect(() => {
        const socketInstance = connect(SOCKET_URL);

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('connect')
        });

        const handleNewClient = async (data: any) => {
            console.log("New client event received:", data);

            setClients((prev) => [...prev, data]);

            try {
                const response = await fetch("http://localhost:8080/simulation/trainStation", {
                    method: "GET",
                });
                const simulationData: TrainSimulationResponse = await response.json();
                console.log("Simulation API response:", simulationData);

                setTimeout(() => {
                    setTrainSimulation(simulationData);
                }, 1000)
            } catch (error) {
                console.error("Error fetching simulation data:", error);
            }
        };

        const handleCashDesk = async (data: CashDesk) => {
            console.log("Cash desk event received:", data);

            try {
                const response = await fetch("http://localhost:8080/simulation/trainStation", {
                    method: "GET",
                });

                const simulationData: TrainSimulationResponse = await response.json();
                console.log("Simulation API response:", simulationData);
                console.log("Cash desk event received:", data);

                setClients(clients => [...clients].map(client => {
                    const previousCashDeskData = trainSimulation?.cashDesks.find(desk => desk.id === data.id);

                    if (previousCashDeskData) {
                        const previousQueue = previousCashDeskData.clientsQueue;
                        const currentQueue = data.clientsQueue;

                        const handledClient = previousQueue.find(client =>
                            !currentQueue.some(newClient => newClient.id === client.id)
                        );

                        if (handledClient) {
                            return handledClient
                        }
                    }

                    return client;
                }));

                setTimeout(() => {
                    setTrainSimulation(simulationData);
                }, 1000)
            } catch (error) {
                console.error("Error fetching simulation data:", error);
            }
        };

        
        const handleDisconnect = (reason: string) => {
            console.log("Socket disconnected:", reason);
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
    
    const [gridDimensions, setGridDimensions] = useState({ width: 0, height: 0 });
    
    useEffect(() => {
        const calculateGridDimensions = () => {
            const containerWidth = document.querySelector('.map-container')?.clientWidth || 0;
            const maxGridWidth = Math.min(containerWidth - 64, 1200); // 64px for padding, max width 1200px
            const cellSize = Math.floor(maxGridWidth / mapWidth);
            
            setGridDimensions({
                width: cellSize * mapWidth,
                height: cellSize * mapHeight
            });
            
            // Update CSS variables
            document.documentElement.style.setProperty("--cell-size", `${cellSize}px`);
            document.documentElement.style.setProperty("--map-width", `${mapWidth}`);
            document.documentElement.style.setProperty("--map-height", `${mapHeight}`);
        };

        calculateGridDimensions();
        window.addEventListener('resize', calculateGridDimensions);
        
        return () => window.removeEventListener('resize', calculateGridDimensions);
    }, [mapWidth, mapHeight]);

    const startSimulation = async () => {
        try {

            if (!isSimulationStarted) {
                await fetch("http://localhost:8080/settings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        deskPositions,
                        entrancePositions,
                        reserveDeskPosition,
                        minServiceTime: location.state.settings.minServiceTime,
                        maxServiceTime: location.state.settings.maxServiceTime,
                        maxClientNumber: location.state.settings.maxClientNumber,
                        stationWidth: parseInt(location.state.settings.mapWidth),
                        stationHeight: parseInt(location.state.settings.mapHeight),
                        clientGenerator: {
                            generatorType: (location.state.selectedStrategy as string).toLowerCase()
                        },
                    }),
                });

                await fetch('http://localhost:8080/simulation/trainStation', {
                    method: "POST"
                });
            }

            if (socket) {
                console.log("Emitting start_simulation event");
                socket.emit("start_simulation");
                setIsSimulationStarted(true);
            }

        } catch (error) {
            console.error("Error in startSimulation:", error);
        }
    };

    const stopSimulation = () => {
        if (socket) {
            console.log("Emitting stop_simulation event");
            socket.emit("stop_simulation");
            navigate('/result-page')

            setIsSimulationStarted(false);
        }
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

    const handleDrop = (itemType: string, x: number, y: number) => {
        if (itemType === DRAG_TYPES.DESK) {
            setDeskPositions((prev) => [...prev, { x, y }]);
        } else if (itemType === DRAG_TYPES.ENTRANCE) {
            setEntrancePositions((prev) => [...prev, { x, y }]);
        } else if (itemType === DRAG_TYPES.RESERVED_DESK) {
            setReserveDeskPosition({ x, y });
        }

        setItemCounts((prev) => ({
            ...prev,
            [itemType]: Math.max(0, prev[itemType] - 1),
        }));
    };

    const fetchLogs = async () => {
        try {
            const response = await fetch("http://localhost:8080/order/log");
            const logsData = await response.json();
            setLogs(logsData);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const showLogs = () => {
        fetchLogs();
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
                            icon={<img src={DeskImage} />}
                            label={'Desk'}
                            onDragStart={setCurrentDragType}
                            count={itemCounts[DRAG_TYPES.DESK]}
                        />
                        <DraggableItem
                            id={2}
                            type={DRAG_TYPES.RESERVED_DESK}
                            icon={<img src={DeskImage} />}
                            label={'Reserved Desk'}
                            onDragStart={setCurrentDragType}
                            count={itemCounts[DRAG_TYPES.RESERVED_DESK]}
                        />
                        <DraggableItem
                            id={3}
                            type={DRAG_TYPES.ENTRANCE}
                            icon={<img src={EntranceImage} />}
                            label={'Entrance'}
                            onDragStart={setCurrentDragType}
                            count={itemCounts[DRAG_TYPES.ENTRANCE]}
                        />
                    </div>}
                    <button className="start-button" onClick={isSimulationStarted ? stopSimulation : startSimulation}>
                        {isSimulationStarted ? 'Stop' : 'Start'} Simulation
                    </button>
                    <button className="start-button" onClick={showLogs}>{!isLogsShown ? 'Show' : 'Close'} Logs</button>
                    {isLogsShown && (
                        <div className="log-list">
                            <LogList logs={logs} />
                        </div>
                    )}
                </header>
                <div className="game-area" style={{ width: gridDimensions.width }}>
                    <div className="drop-area">
                        <RedRectanglesRow
                            currentDragType={currentDragType}
                            dragType={[DRAG_TYPES.DESK, DRAG_TYPES.RESERVED_DESK]}
                            columnCount={mapWidth}
                            availableColumns={availableColumns}
                            onDrop={handleDrop}
                            gridHeight={mapHeight}
                        />
                    </div>
                    
                    <div 
                        className="grid-container"
                        style={{
                            width: gridDimensions.width,
                            height: gridDimensions.height
                        }}
                    >
                        {grid.map((row, y) =>
                            row.map((cell, x) => {
                                const client = clients.find(
                                    (pos) => pos.position.x === (x + 1) && pos.position.y === (y + 1)
                                );

                                return (
                                    <GridCell
                                        key={`${y}-${x}`}
                                        x={x}
                                        y={y}
                                        currentDragType={currentDragType}
                                        item={cell}
                                        placedItem={client}
                                        className="grid-cell"
                                    />
                                );
                            })
                        )}
                    </div>
                    <RedRectanglesRow
                        currentDragType={currentDragType}
                        dragType={DRAG_TYPES.ENTRANCE}
                        columnCount={mapWidth}
                        gridHeight={mapHeight}
                        availableColumns={availableEntranceColumns}
                        onDrop={handleDrop}
                    />
                </div>
            </div>
        </DndProvider>
    );
};

export default ConstructorMap;