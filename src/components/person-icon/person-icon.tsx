import { FC } from "react";

type Props = {
    color: string;
}

export const PersonIcon: FC<Props> = ({ color }) => {
    return (    
        <svg fill={color} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            width="800px" height="800px" viewBox="0 0 125.2 125.2" xml:space="preserve"
        >
            <g>
                <path d="M52.65,125.2h19.9c3.3,0,6-2.7,6-6V86.301h3.399c3.301,0,6-2.701,6-6V43.2c0-3.3-2.699-6-6-6H43.25c-3.3,0-6,2.7-6,6
		v37.101c0,3.299,2.7,6,6,6h3.4V119.2C46.65,122.5,49.25,125.2,52.65,125.2z"/>
                <circle cx="62.55" cy="15.7" r="15.7" />
            </g>
        </svg>
    )
}