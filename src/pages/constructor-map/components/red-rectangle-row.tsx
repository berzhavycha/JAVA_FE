import { useState } from "react";
import { DRAG_TYPES, GridCell } from "./grid-cell";

export const RedRectanglesRow = ({ currentDragType, dragType, gridHeight, availableColumns, columnCount, onDrop }: {
    currentDragType: string,
    gridHeight: number,
    dragType: string | string[],
    columnCount: number;
    availableColumns: number[];
    onDrop: (type: string, x: number, y: number) => void;
}) => {
    const [grid, setGrid] = useState(Array.from({ length: 20 }, () => Array(columnCount).fill(null)));

    const handleDrop = (item, x) => {
        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((row) => [...row]);
            newGrid[0][x] = item;
            return newGrid;
        });

        console.log('call')

        onDrop(item.type, x, dragType === DRAG_TYPES.ENTRANCE ? gridHeight : 1);
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
                            y={currentDragType === DRAG_TYPES.ENTRANCE ? gridHeight : 1}
                            onDrop={(item, x, currentType = 'optional', type = 'optional') => {
                                if(Array.isArray(dragType) && dragType.includes(currentDragType) || dragType === currentDragType) {
                                    handleDrop(item, x)
                                }
                            }}
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