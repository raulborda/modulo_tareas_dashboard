import GraphView from "../views/GraphView";
import TableView from "../views/TableView";
import { TaskContext } from "../../context/TaskContext";
import { useContext } from "react";

const MainLayout = () => {
  const { viewMode } = useContext(TaskContext);

  const renderView = () => {
    if (viewMode === "tableView") {
      return <TableView />;
    }
    if (viewMode === "graphView") {
      return <GraphView />;
    }
  };

  return renderView();
};

export default MainLayout;
