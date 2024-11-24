import { FC } from "react";

export enum CLIENT_TYPE {
    SOLDIER = "_soldier",
    STUDENT = "_student",
    WITH_CHILD = "_withChild",
    DISABLED = "_disabled",
}

const PersonColorMapper: Record<string, string> = {
    [CLIENT_TYPE.SOLDIER]: "green",
    [CLIENT_TYPE.STUDENT]: "yellow",
    [CLIENT_TYPE.WITH_CHILD]: "blue",
    [CLIENT_TYPE.DISABLED]: "red",
};

const generateGradientId = (types: string[]): string => types.sort().join("-");

type Props = {
    types: CLIENT_TYPE[];
};

export const PersonIcon: FC<Props> = ({ types }) => {
    const colors = types.map((type) => PersonColorMapper[type]);
    const gradientId = generateGradientId(types);

    return (
        <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="800px"
            height="800px"
            viewBox="0 0 125.2 125.2"
            xmlSpace="preserve"
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    {colors.map((color, index) => (
                        <stop
                            key={index}
                            offset={`${(index / (colors.length - 1)) * 100}%`}
                            stopColor={color}
                        />
                    ))}
                </linearGradient>
            </defs>
            <g>
                <path
                    d="M52.65,125.2h19.9c3.3,0,6-2.7,6-6V86.301h3.399c3.301,0,6-2.701,6-6V43.2c0-3.3-2.699-6-6-6H43.25c-3.3,0-6,2.7-6,6
          v37.101c0,3.299,2.7,6,6,6h3.4V119.2C46.65,122.5,49.25,125.2,52.65,125.2z"
                    fill={`url(#${gradientId})`}
                />
                <circle
                    cx="62.55"
                    cy="15.7"
                    r="15.7"
                    fill={`url(#${gradientId})`}
                />
            </g>
        </svg>
    );
};
