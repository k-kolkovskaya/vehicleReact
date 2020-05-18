import React from "react";

import { IRoutesProps } from "./IRoutesProps";

import styles from "./Routes.module.scss";

const routes: React.SFC<IRoutesProps> = (props) => {

    let activeRow: string[] = [];
    if (props.routes) {
        activeRow = props.routes.filter(row => row[0] === props.activeRow)[0];
    }

    return (
        activeRow
            ? (
                <div className="routes">
                    <h3 className={styles.routes__title}>Choose needeed route number, please</h3>
                    <ul className={styles.routes__container} key={activeRow[0]}>
                        {activeRow.map(route => {
                            return (
                                <li
                                    className={route === props.activeRoute ? styles.routes__li_active : styles.routes__li}
                                    onClick={() => props.setActiveRoute(route)}
                                    key={route}
                                >{route}</li>
                            )
                        })
                        }
                    </ul>
                </div>
            )
            : null
    )
};

export default routes;