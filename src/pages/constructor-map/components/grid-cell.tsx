import { useDrop } from "react-dnd";
import { FC } from "react";
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
};

export const DRAG_TYPES = {
    DESK: "desk",
    RESERVED_DESK: "reserved_desk",
    ENTRANCE: "entrance",
};

export enum CLIENT_TYPE {
    SOLDIER = "_soldier",
    STUDENT = "_student",
    WITH_CHILD = "_withChild",
    DISABLED = "_disabled",
}

const parseClientTypes = (type: string): CLIENT_TYPE[] => {
    const parts = type
        .split("_")
        .slice(1); 
    return parts.map((part) => `_${part}` as CLIENT_TYPE);
};

export const GridCell: FC<Props> = ({
    currentDragType,
    x,
    y,
    onDrop,
    item,
    className,
    placedItem,
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

    return (
        <div
            ref={drop}
            className={`grid-cell ${isOver ? "hovered" : ""} ${canDrop ? "droppable" : ""
                } ${className}`}
        >
            {item && (
                <img
                    src={
                        item.type === DRAG_TYPES.DESK ||
                            item.type === DRAG_TYPES.RESERVED_DESK
                            ? DeskImage
                            : EntranceImage
                    }
                    alt={item.type}
                />
            )}
            {placedItem && (
                <PersonIcon types={parseClientTypes(placedItem.type)} />
            )}
        </div>
    );
};
