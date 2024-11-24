import { useState } from "react";
import { DRAG_TYPES, GridCell } from "./grid-cell";

export const RedRectanglesRow = ({ currentDragType, gridHeight, columnCount, onDrop, isTopRow = false }: {
    currentDragType: string,
    gridHeight: number,
    dragType: string | string[],
    columnCount: number;
    onDrop: (type: string, x: number, y: number) => void;
    isTopRow?: boolean;
}) => {
    const [grid, setGrid] = useState(Array.from({ length: 20 }, () => Array(columnCount).fill(null)));

    const isValidDrop = (itemType: string) => {
        // For top row: allow only desks (both regular and reserved)
        if (isTopRow) {
            return itemType === DRAG_TYPES.DESK || itemType === DRAG_TYPES.RESERVED_DESK;
        }
        // For bottom row: allow only entrances
        return itemType === DRAG_TYPES.ENTRANCE;
    };

    const handleDrop = (item: { type: string }, x: number) => {
        if (!isValidDrop(item.type)) {
            return; // Prevent invalid drops
        }

        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((row) => [...row]);
            newGrid[0][x] = item;
            return newGrid;
        });

        onDrop(item.type, x, isTopRow ? 1 : gridHeight);
    };

    return (
        <>
            <div className="desk-grid">
                {grid[0].map((cell, x) => {
                    return (
                        <GridCell
                            currentDragType={currentDragType}
                            key={`${x}`}
                            x={x}
                            y={currentDragType === DRAG_TYPES.ENTRANCE ? gridHeight : 1}
                            onDrop={handleDrop}
                            item={cell}
                            className={`desk-grid-cell`}
                        />
                    )
                })}
            </div>
        </>
    );
};