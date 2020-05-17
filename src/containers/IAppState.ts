import { IStopPoint } from "../entities/StopPoint";

export interface IStopPoints {
    stops: IStopPoint[];
    isLoading: boolean;
}