import TaskStackedBar from "./graphics/TaskStackedBar";
import TaskHeader from "./header/TaskHeader";
import TaskTableByUser from "./table/TaskTableByUser";

const TaskDashboard = ({ dataGraph, dataTable, dataTotales }) => {
  return (
    <>
      <TaskHeader data={dataTotales} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <TaskTableByUser data={dataTable} />
        <TaskStackedBar data={dataGraph} />
      </div>
    </>
  );
};

export default TaskDashboard;
