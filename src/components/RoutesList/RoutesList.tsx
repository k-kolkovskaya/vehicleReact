import React from "react";

import { IRoutesListProps } from "./IRoutesListProps";

import styles from "./RoutesList.module.scss";

const routesList: React.SFC<IRoutesListProps> = (props) => {

    return (
        <ul className={styles.routesList}>
            {
                props.routes
                    ? props.routes.map(row => {
                        return (
                            <ul key={row[0]} className={styles.routesList__row}>
                                <li className={props.activeRow === row[0] ? styles.routesList__li_active : styles.routesList__li} onClick={() => props.setActiveRow(row[0])}>{`${row[0]} - ${row[row.length - 1]}`}</li>
                            </ul>
                        )
                    })
                    : <li>There is no routes yet :(</li>
            }
        </ul>
    )
};

export default routesList;