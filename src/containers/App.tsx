import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import axios from "axios";

import { updateObject } from "../shared/utility";

import { IBusSequence } from "../entities/BusSeaquence";
import { IStopPoints } from "./IAppState";
import { IStopPoint } from "../entities/StopPoint";

import RoutesList from "../components/RoutesList/RoutesList";
import Routes from "../components/Routes/Routes";
import Spinner from "../components/UI/Spinner/Spinner";
import StopPoints from "../components/StopPoints/StopPoints";

import styles from "./App.module.scss";

let csvData = require('../data/busSequences.csv');


const App = () => {

  const [activeRoute, setActiveRoute] = useState<string>("");
  const [activeRow, setActiveRow] = useState<string>("");

  const splitArray = (arr: string[], len) => {
    let chunks: string[][] = [], i = 0, n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }
    return chunks;
  }

  const [routes, setRoutes] = useState<string[][]>([]);
  useEffect(() => {
    const fetchRoutesNumbersAsync = async () => {
      const response = await fetch(csvData);
      const reader = response.body!.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      const results = Papa.parse(csv, { header: true });
      const rows: IBusSequence[] = results.data;

      let routesNumbers = new Set<string>();
      rows.map(row => {
        routesNumbers.add(row.Route);
        return routesNumbers;
      })

      let splittedArray = splitArray(Array.from(routesNumbers), 15);

      setRoutes(splittedArray);
    }
    fetchRoutesNumbersAsync()
  }, []);

  const [stopPoints, setStopPoints] = useState<IStopPoints>({
    stops: [],
    isLoading: false
  });
  useEffect(() => {
    const fetchStopPointsAsync = async () => {
      if (activeRoute) {
        setStopPoints(updateObject(stopPoints, { isLoading: true }));
        await axios.get(`https://api.tfl.gov.uk/Line/${activeRoute}/StopPoints?app_id=b26751e6&app_key=4276de01eb7420bcb568bb315f4d60e9`)
          .then(response => {

            let newArray = response.data.map(stopInfo => (
              stopInfo = {
                id: stopInfo.id,
                commonName: stopInfo.commonName
              }
            ));
            const result: IStopPoint[] = [];
            const map = new Map();
            for (const item of newArray) {
              if (!map.has(item.commonName)) {
                map.set(item.commonName, true);
                result.push({
                  id: item.id,
                  commonName: item.commonName
                });
              }
            }
            setStopPoints(updateObject(stopPoints, { stops: result, isLoading: false }));
          })
          .catch(e => {
            console.log(e);
            setStopPoints(updateObject(stopPoints, { stops: [{ id: 0, commonName: "There is no stoppoints on this route yet" }], isLoading: false }));
          })
      }
    }
    fetchStopPointsAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoute]);


  const activeRouteHandler = (id) => {
    setActiveRoute("");
    setActiveRoute(id);
  }

  const activeRowHandler = (id) => {
    setStopPoints(updateObject(stopPoints, { stops: [], isLoading: false }));
    setActiveRow(id);
  }

  return (
    <div className={styles.app}>
      <h3 className={styles.app__title}>Choose the range of routes, please</h3>
      <RoutesList
        setActiveRow={activeRowHandler}
        activeRow={activeRow}
        routes={routes}
      />
      <Routes
        setActiveRoute={activeRouteHandler}
        activeRow={activeRow}
        activeRoute={activeRoute}
        routes={routes}
      />
      {!stopPoints.isLoading
        ? <StopPoints
          stops={stopPoints.stops}
        />
        : <Spinner />
      }
    </div>
  )
};

export default App;
