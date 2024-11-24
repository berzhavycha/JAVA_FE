import { FC } from "react";
import { useDrag } from "react-dnd";
import '../constructor-map.css'

type Props = {
    id: number;
    type: string;
    label :any;
    onDragStart: (type: string) => void;
    count: number
}

export const DraggableItem: FC<Props> = ({ id, type, label, onDragStart, count }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type,
        item: () => {
            if (count > 0) {
                onDragStart(type);
                return { id, type };
            }
            return null;
        },
        canDrag: () => count > 0,
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
                    pointerEvents: count > 0 ? "auto" : "none",
                }}
            >
                {label}
                <span className="item-counter">{count}</span>
            </div>
        </div>
    );
};
