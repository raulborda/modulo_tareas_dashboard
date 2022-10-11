import { Card, Table } from "antd";
import "./index.css";

const TaskTableByUser = ({ data }) => {
  const columns = [
    {
      title: "Usuario",
      dataIndex: "usu_nombre",
      key: "usu_nombre",
      ellipsis: true,
      sorter: (a, b) => a.usu_nombre.localeCompare(b),
      align: "left",
    },

    {
      title: "Abiertas",
      dataIndex: "totalAbiertas",
      key: "totalAbiertas",
      ellipsis: true,
      align: "right",
    },
    {
      title: "Vigentes",
      dataIndex: "vigentes",
      key: "vigentes",
      ellipsis: true,
      align: "right",
    },

    {
      title: "Vencidas",
      dataIndex: "vencidas",
      key: "vencidas",
      ellipsis: true,
      align: "right",
    },
  ];

  return (
    <Card
      title="TAREAS ABIERTAS POR USUARIO"
      size="small"
      style={{ padding: "5px" }}
    >
      <Table
        size="small"
        dataSource={data}
        pagination={{ pageSize: 12 }}
        columns={columns}
      />
    </Card>
  );
};

export default TaskTableByUser;
