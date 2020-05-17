import React from "react";
import styles from "./Spinner.module.scss";

const spinner = () => {
    return (
        <div className={styles.spinner}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}


export default spinner;