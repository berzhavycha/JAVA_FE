import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./constructor-map.css";
import DeskImage from '../../assets/information-desk 2.png';
import EntranceImage from '../../assets/Entrance.png';
import { useLocation } from "react-router-dom";
import LogList from "../../components/log-list/log-list";
import { Socket, connect } from "socket.io-client";
import { DraggableItem } from "./components/draggable-item";
import { GridCell } from "./components/grid-cell";
import { RedRectanglesRow } from "./components/red-rectangle-row";
import { Timer } from "./components/timer";

export const DRAG_TYPES = {
    DESK: "desk",
    RESERVED_DESK: "reserved_desk",
    ENTRANCE: "entrance",
};

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
        [DRAG_TYPES.RESERVED_DESK]: 3,
    });
    const [isLogsShown, setIsLogShown] = useState<boolean>(false)
    const [socket, setSocket] = useState<Socket | null>(null);

    const [deskPositions, setDeskPositions] = useState<{ x: number; y: number }[]>([]);
    const [entrancePositions, setEntrancePositions] = useState<{ x: number; y: number }[]>([]);
    const [reservedDeskPositions, setReservedDeskPosition] = useState<{ x: number; y: number } | null>(null);

    console.log(location.state.settings)

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
                await fetch("http://localhost:8080/settings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        deskPositions,
                        entrancePositions,
                        reservedDeskPositions,
                        minServiceTime: location.state.settings.minServiceTime,
                        maxServiceTime: location.state.settings.minServiceTime,
                        maxClientNumber: location.state.settings.maxClient,
                        stationWidth:  location.state.settings.maxWidth,
                        stationHeight:  location.state.settings.maxHeight,
                        clientGenerator: {
                            generatorType: location.state.settings.selectedStrategy
                        },
                    }),
                });

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


    const startSimulation = async () => {
        try {

            if (!isSimulationStarted) {
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
            setReservedDeskPosition({ x, y });
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
                    <button className="start-button" onClick={showLogs}>{!isLogsShown ? 'Show' : 'Close'} Logs</button>
                    {isLogsShown && (
                        <div className="log-list">
                            <LogList logs={logs} />
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
                            const isManHere = clients.some((pos) => pos.position.x === (x + 1) && pos.position.y === (y + 1));
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