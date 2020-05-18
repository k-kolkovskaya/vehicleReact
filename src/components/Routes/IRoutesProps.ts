export interface IRoutesProps {
    setActiveRoute: (id: string) => void;
    activeRow: string;
    activeRoute: string;
    routes: string[][];
}