import { useEffect, useState } from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

export const SvgClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const hourHandRotation = (time.getHours() % 12) * 30 + time.getMinutes() / 2;
    const minuteHandRotation = time.getMinutes() * 6;
    const secondHandRotation = time.getSeconds() * 6;

    return (
        <Svg height="50" width="50">
            <Circle cx="25" cy="25" r="22" stroke="black" strokeWidth="2.5" fill="white" />
            {/*Hour Hand*/}
            <Line
                x1="25"
                y1="25"
                x2="25"
                y2="12"
                stroke="black"
                strokeWidth="3"
                transform={`rotate(${hourHandRotation}, 25, 25)`}
            />
            {/*Minute Hand*/}
            <Line
                x1="25"
                y1="25"
                x2="25"
                y2="6"
                stroke="black"
                strokeWidth="2"
                transform={`rotate(${minuteHandRotation}, 25, 25)`}
            />
            {/*Second Hand*/}
            <Line
                x1="25"
                y1="25"
                x2="25"
                y2="5"
                stroke="black"
                strokeWidth="1"
                transform={`rotate(${secondHandRotation}, 25, 25)`}
            />
        </Svg>
    );
};
