import { FC, useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./constructor-map.css";
import DeskImage from '../../assets/information-desk 2.png';
import EntranceImage from '../../assets/Entrance.png';
import { useLocation } from "react-router-dom";

const DRAG_TYPES = {
    DESK: "desk",
    RESERVED_DESK: "reserved_desk",
    ENTRANCE: "entrance",
};

const DraggableItem = ({ id, type, label, onDragStart, count }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type,
        item: () => {
            // Only allow drag if count > 0
            if (count > 0) {
                onDragStart(type);
                return { id, type };
            }
            return null;
        },
        canDrag: () => count > 0, // Explicitly prevent dragging when count is 0
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
                    pointerEvents: count > 0 ? "auto" : "none", // Disable pointer events when count is 0
                }}
            >
                {label}
                <span className="item-counter">{count}</span>
            </div>
        </div>
    );
};

const GridCell = ({ x, onDrop, item, className }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: [DRAG_TYPES.DESK, DRAG_TYPES.RESERVED_DESK, DRAG_TYPES.ENTRANCE],
        drop: (draggedItem) => {
            if (draggedItem) {  // Only process drop if we have a valid item
                onDrop(draggedItem, x);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop() && monitor.getItem() !== null, // Only allow drop if we have a valid item
        }),
    }));

    return (
        <div
            ref={drop}
            className={`grid-cell ${isOver ? "hovered" : ""} ${canDrop ? "droppable" : ""} ${className}`}
        >
            {item && (
                <span>
                    <img
                        src={item.type === DRAG_TYPES.DESK || item.type === DRAG_TYPES.RESERVED_DESK ? DeskImage : EntranceImage}
                        alt={item.type}
                    />
                </span>
            )}
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
            {currentDragType === dragType && dragType === DRAG_TYPES.ENTRANCE && (
                <div className="red-rectangles-row">
                    {Array.from({ length: columnCount }).map((_, index) => (
                        <div key={index} className="red-rectangle" />
                    ))}
                </div>
            )}
            <div className="desk-grid">
                {grid[0].map((cell, x) => {
                    const isAvailable = availableColumns.includes(x);
                    return isAvailable ? (
                        <GridCell
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
            {Array.isArray(dragType) && dragType.includes(currentDragType) && (
                <div className="red-rectangles-row">
                    {Array.from({ length: columnCount }).map((_, index) => (
                        <div key={index} className="red-rectangle" />
                    ))}
                </div>
            )}
        </>
    );
};

export const ConstructorMap = () => {
    const [currentDragType, setCurrentDragType] = useState("");
    const location = useLocation();
    console.log(location.state);

    const mapWidth = parseInt(location.state.settings.mapWidth);
    const mapHeight = parseInt(location.state.settings.mapHeight);

    const [itemCounts, setItemCounts] = useState({
        [DRAG_TYPES.DESK]: parseInt(location.state.settings.desks),
        [DRAG_TYPES.ENTRANCE]: parseInt(location.state.settings.entrances),
        [DRAG_TYPES.RESERVED_DESK]: 3,
    });

    const [grid, setGrid] = useState(
        Array.from({ length: mapHeight }, () => Array(mapWidth).fill(null))
    );

    useEffect(() => {
        document.documentElement.style.setProperty("--map-width", `${mapWidth}`);
        document.documentElement.style.setProperty("--map-height", `${mapHeight}`);
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


    return (
        <DndProvider backend={HTML5Backend}>
            <div className="map-container">
                <header className="map-header">
                    <h1 className="map-title">Construct your map</h1>
                    <div className="controls">
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
                    </div>
                    <button className="start-button">Start Simulation</button>
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
                        row.map((cell, x) => (
                            <div key={`${y}-${x}`} className="grid-cell" />
                        ))
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