import { forwardRef, useImperativeHandle, useState } from "react";
import { DRAG_TYPES, GridCell } from "./grid-cell";

export interface RedRectanglesRowHandle {
    onStatusChangeDesk: (x: number, broken: boolean) => void;
}

interface RedRectanglesRowProps {
    currentDragType: string;
    gridHeight: number;
    dragType: string | string[];
    columnCount: number;
    onDrop: (type: string, x: number, y: number) => void;
    isTopRow?: boolean;
}

export const RedRectanglesRow = forwardRef<RedRectanglesRowHandle, RedRectanglesRowProps>(
    ({ currentDragType, gridHeight, columnCount, onDrop, isTopRow = false }, ref) => {
        const [grid, setGrid] = useState(Array.from({ length: 20 }, () => Array(columnCount).fill(null)));

        const isValidDrop = (itemType: string) => {
            if (isTopRow) {
                return itemType === DRAG_TYPES.DESK || itemType === DRAG_TYPES.RESERVED_DESK;
            }
            return itemType === DRAG_TYPES.ENTRANCE;
        };

        const handleDrop = (item: { type: string; broken: boolean }, x: number) => {
            if (!isValidDrop(item.type)) {
                return;
            }

            setGrid((prevGrid) => {
                const newGrid = prevGrid.map((row) => [...row]);
                newGrid[0][x] = item;
                return newGrid;
            });

            onDrop(item.type, x, isTopRow ? 1 : gridHeight);
        };

        const onStatusChangeDesk = (x: number, broken: boolean) => {
            setGrid((prevGrid) => {
                const newGrid = prevGrid.map((row) => [...row]);
                const item = newGrid[0][x];
                newGrid[0][x] = { ...item, broken };
                return newGrid;
            });
        };

        useImperativeHandle(ref, () => ({
            onStatusChangeDesk
        }));

        return (
            <div className="desk-grid">
                {grid[0].map((cell, x) => (
                    <GridCell
                        currentDragType={currentDragType}
                        key={`${x}`}
                        x={x}
                        y={currentDragType === DRAG_TYPES.ENTRANCE ? gridHeight : 1}
                        onDrop={handleDrop}
                        item={cell}
                        className="desk-grid-cell"
                        isBroken={cell?.broken}
                    />
                ))}
            </div>
        );
    }
);

RedRectanglesRow.displayName = "RedRectanglesRow";