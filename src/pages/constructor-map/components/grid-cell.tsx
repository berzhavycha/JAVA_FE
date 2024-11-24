import { useDrop } from "react-dnd";
import { DRAG_TYPES } from "../constructor-map";
import { FC } from "react";
import DeskImage from '../../../assets/information-desk 2.png';
import EntranceImage from '../../../assets/Entrance.png';
import StandingManImage from '../../../assets/standing-up-man- 4.png'

type Props = {
    currentDragType: string;
    x: number;
    onDrop: (draggedItem: unknown, x: number) => void;
    item: any;
    placedItem: any;
    className?: string;
}

export const GridCell: FC<Props> = ({ currentDragType, x, onDrop, item, className, placedItem }) => {
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
