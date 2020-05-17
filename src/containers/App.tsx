import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import axios from "axios";

import { updateObject } from "../shared/utility";

import { IBusSequence } from "../entities/BusSeaquence";
import { IStopPoints } from "./IAppState";

import RoutesList from "../components/RoutesList/RoutesList";
import Spinner from "../components/UI/Spinner/Spinner";
import StopPoints from "../components/StopPoints/StopPoints";

import styles from "./App.module.scss";

let csvData = require('../data/busSequences.csv');


const App = () => {
  const [routes, setRoutes] = useState<string[]>([]);
  const [activeRoute, setActiveRoute] = useState<Number | null>(null);
  const [stopPoints, setStopPoints] = useState<IStopPoints>({
    stops: [],
    isLoading: false
  });

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

      setRoutes(Array.from(routesNumbers));
    }
    fetchRoutesNumbersAsync()
  }, []);

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
            ))

            setStopPoints(updateObject(stopPoints, { stops: newArray, isLoading: false }));
          })
      }
    }
    fetchStopPointsAsync()
  }, [activeRoute]);

  const activeRouteHandler = (id) => {
    setActiveRoute(id);
  }

  return (
    <div className={styles.app}>
      <RoutesList
        click={activeRouteHandler}
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
