import React from "react";

import { IRoutesListProps } from "./IRoutesListProps";

import styles from "./RoutesList.module.scss";

const routesList: React.SFC<IRoutesListProps> = (props) => {
    return (
        <ul className={styles.routesList}>
            {
                props.routes
                    ? props.routes.map(route => {
                        return (
                            <li
                                onClick={() => props.click(route)}
                                key={route}
                            >{route}</li>
                        )
                    })
                    : <li>There is no routes yet :(</li>
            }
        </ul>
    )
};

export default routesList;