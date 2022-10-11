import { Drawer } from "antd";
import { TaskContext } from "../../context/TaskContext";
import { useContext } from "react";

const TaskDrawer = ({ children }) => {
  const { taskDrawerVisible, setTaskDrawerVisible } = useContext(TaskContext);

  return (
    <Drawer
      width={taskDrawerVisible.content === "Mis Tareas" ? 600 : 500}
      destroyOnClose
      maskClosable={false}
      title={taskDrawerVisible.content}
      placement={"right"}
      closable={false}
      onClose={() => setTaskDrawerVisible({ visible: false, content: null })}
      visible={taskDrawerVisible.visible}
      key={"taskDrawer"}
    >
      {children}
    </Drawer>
  );
};

export default TaskDrawer;
