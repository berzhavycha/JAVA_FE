import { FC, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./constructor-map.css";

type DragItem = {
    type: string;
    id: number;
};

const DRAG_TYPES = {
    DESK: "desk",
    ENTRANCE: "entrance",
};

const DraggableItem: FC<{
    id: number;
    type: string;
    label: string;
    onDragStart: (type: string) => void;
}> = ({ id, type, label, onDragStart }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type,
        item: () => {
            onDragStart(type); // Notify parent of the current drag type
            return { id, type }; // Return the item object
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        end: () => onDragStart(""), // Reset the drag state when dragging ends
    }));

    return (
        <div
            ref={drag}
            className="draggable-item"
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: "move",
            }}
        >
            {label}
        </div>
    );
};


const GridCell: FC<{
    x: number;
    onDrop: (item: DragItem, x: number) => void;
    item: DragItem | null; // Pass the cell's content
    className?: string;
}> = ({ x, onDrop, item, className }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: [DRAG_TYPES.DESK, DRAG_TYPES.ENTRANCE],
        drop: (draggedItem: DragItem) => onDrop(draggedItem, x),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }));

    return (
        <div
            ref={drop}
            className={`grid-cell ${isOver ? "hovered" : ""} ${canDrop ? "droppable" : ""} ${className}`}
        >
            {item && <span>{item.type === DRAG_TYPES.DESK ? "Desk" : "Entrance"}</span>}
        </div>
    );
};

const RedRectanglesRow: FC<{ currentDragType: string, dragType: string; columnCount: number, availableColumns: number[]; }> = ({ currentDragType, dragType, columnCount, availableColumns }) => {
    const [grid, setGrid] = useState<(null | DragItem)[][]>(
        Array.from({ length: 20 }, () => Array(20).fill(null))
    );

    const handleDrop = (item: DragItem, x: number) => {
        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((row) => [...row]);
            newGrid[0][x] = item;
            return newGrid;
        });
    };


    return (
        <>
            {currentDragType === dragType && dragType === DRAG_TYPES.ENTRANCE && (
                <div className="red-rectangles-row">
                    {Array.from({ length: columnCount }).map((_, index) => (
                        <>
                            <div key={index} className="red-rectangle" />
                        </>
                    ))}
                </div>
            )}
            <div className="desk-grid">
                {grid[0].map((cell, x) => {
                    const isAvailable = availableColumns.includes(x);

                    return (
                        <>
                            {isAvailable ? (
                                <GridCell
                                    key={`${x}`}
                                    x={x}
                                    onDrop={handleDrop}
                                    item={cell}
                                    className="desk-grid-cell"
                                />
                            ) : (
                                <div className="unavailable-grid-cell"></div>
                            )}
                        </>

                    )
                })}
            </div>
            {currentDragType === dragType && dragType === DRAG_TYPES.DESK && (
                <div className="red-rectangles-row">
                    {Array.from({ length: columnCount }).map((_, index) => (
                        <>
                            <div key={index} className="red-rectangle" />
                        </>
                    ))}
                </div>
            )}
        </>
    );
};

export const ConstructorMap: FC = () => {
    const [grid, setGrid] = useState<(null | DragItem)[][]>(
        Array.from({ length: 10 }, () => Array(10).fill(null))
    );
    const [currentDragType, setCurrentDragType] = useState<string>("");
    const availableColumns = [0, 1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="map-container">
                <header className="map-header">
                    <h1 className="map-title">Construct your map</h1>
                    <div className="controls">
                        <DraggableItem
                            id={1}
                            type={DRAG_TYPES.DESK}
                            label="Desk"
                            onDragStart={setCurrentDragType}
                        />
                        <DraggableItem
                            id={2}
                            type={DRAG_TYPES.ENTRANCE}
                            label="Entrance"
                            onDragStart={setCurrentDragType}
                        />
                    </div>
                    <button className="start-button">Start Simulation</button>
                </header>
                <RedRectanglesRow currentDragType={currentDragType} dragType={DRAG_TYPES.DESK} columnCount={20} availableColumns={availableColumns} />
                <div className="grid-container">
                    {grid.map((row, y) =>
                        row.map((cell, x) => (
                            <div
                                className={`grid-cell`}
                            >
                            </div>
                        ))
                    )}
                </div>
                <RedRectanglesRow currentDragType={currentDragType} dragType={DRAG_TYPES.ENTRANCE} columnCount={20} availableColumns={availableColumns} />
            </div>
        </DndProvider>
    );
};
