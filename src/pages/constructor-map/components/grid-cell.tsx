import React from 'react';
import { useDrop } from 'react-dnd';
import DeskImage from "../../../assets/information-desk 2.png";
import EntranceImage from "../../../assets/Entrance.png";
import { PersonIcon } from "../../../components/person-icon/person-icon";

type Props = {
    currentDragType: string;
    x: number;
    y: number;
    onDrop?: (draggedItem: unknown, x: number, y: number) => void;
    item: any;
    placedItem?: any;
    className?: string;
    isBroken?: boolean;
};

export const DRAG_TYPES = {
    DESK: "desk",
    RESERVED_DESK: "reserved_desk",
    ENTRANCE: "entrance",
};

const parseClientTypes = (type: string) => {
    const parts = type.split("_").slice(1);
    return parts.map((part) => `_${part}`);
};

export const GridCell: React.FC<Props> = ({
    currentDragType,
    x,
    y,
    onDrop,
    item,
    className,
    placedItem,
    isBroken,
}) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: [DRAG_TYPES.DESK, DRAG_TYPES.RESERVED_DESK, DRAG_TYPES.ENTRANCE],
        drop: (draggedItem) => {
            if (draggedItem && onDrop) {
                onDrop(draggedItem, x, y);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop:
                !!monitor.canDrop() &&
                monitor.getItem() !== null &&
                monitor.getItem().type === currentDragType,
        }),
    }));

    const isDesk = item && (item.type === DRAG_TYPES.DESK || item.type === DRAG_TYPES.RESERVED_DESK);

    return (
        <div
            ref={drop}
            className={`grid-cell ${isOver ? "hovered" : ""} ${canDrop ? "droppable" : ""} ${className}`}
        >
            {isDesk && (
                <div
                    className="desk-label"
                    style={{
                        color: isBroken ? 'red' : 'green',
                        fontSize: 'calc(var(--cell-size) * 0.15)', 
                        fontWeight: `calc(200 + (var(--cell-size) * 0.1))`,
                    }}
                >
                    {isBroken ? 'Broken' : 'Operational'}
                </div>
            )}
            {item && (
                <img
                    src={
                        isDesk
                            ? DeskImage
                            : EntranceImage
                    }
                    alt={item.type}
                    style={{
                        width: '80%',
                        height: 'auto',
                    }}
                />
            )}
            {placedItem && (
                <PersonIcon types={parseClientTypes(placedItem.type)} />
            )}
        </div>
    );
};