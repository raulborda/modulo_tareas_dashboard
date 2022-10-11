import { Col } from "antd";
import TaskCalendar from "../../drawer/taskCalendar/TaskCalendar";
import TaskDrawer from "../../drawer/TaskDrawer";
import EditTaskForm from "../../form/EditTaskForm";
import NewTaskForm from "../../form/NewTaskForm";
import SeeTaskForm from "../../form/SeeTaskForm";
import { TaskContext } from "../../../context/TaskContext";
import { useContext } from "react";
import "./index.css";

const BodyLayout = ({ queryPoll, children }) => {
  const { taskDrawerVisible } = useContext(TaskContext);

  const returnFormComponent = () => {
    if (taskDrawerVisible.content === "Nueva Tarea") {
      return <NewTaskForm queryPoll={queryPoll} />;
    }
    if (taskDrawerVisible.content === "Editar Tarea") {
      return <EditTaskForm task={taskDrawerVisible.task} />;
    }
    if (taskDrawerVisible.content === "Mis Tareas") {
      return <TaskCalendar queryPoll={queryPoll} />;
    }
    if (taskDrawerVisible.content === "Ver Tarea") {
      return <SeeTaskForm task={taskDrawerVisible.task} />;
    }
  };

  return (
    <Col className="body-col">
      <TaskDrawer children={returnFormComponent()} queryPoll />
      <Col className="children-wrapper">{children}</Col>
    </Col>
  );
};

export default BodyLayout;
