import React from "react";

import { IStopPointsProps } from "./IStopPointsProps";

import styles from "./StopPoints.module.scss";

const stopPoints: React.SFC<IStopPointsProps> = (props) => {
    return (
        <ul className={styles.stopPoints}>
            {
                props.stops
                    ? props.stops.map(stop => (
                        <li key={stop.id}>{stop.commonName}</li>
                    ))
                    : <li>There is no stoppoints required this route.</li>
            }
        </ul>
    )
};

export default stopPoints;