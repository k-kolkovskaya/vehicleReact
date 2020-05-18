export interface IRoutesListProps {
    routes: string[][];
    setActiveRow: (id: string) => void;
    activeRow: string;
}