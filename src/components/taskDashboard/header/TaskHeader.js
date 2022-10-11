import { Card } from "antd";
import "./index.css";

const TaskHeader = ({ data }) => {
  return (
    <Card style={{ padding: "5px", height: "110px" }}>
      {data && data.length ? (
        <div className="indicator_wrapper">
          <span>{data[0].totales} TAREAS</span>
          <span>
            {data[0].abiertas} ABIERTAS
            <div className="detail-task-wrapper">
              <span style={{ color: "green" }}>
                {data[0].vigentes}{" "}
                {data[0].vigentes > 1 || data[0].vigentes === 0
                  ? "VIGENTES"
                  : "VIGENTE"}
              </span>
              <span style={{ color: "red" }}>
                {data[0].vencidas}{" "}
                {data[0].vencidas > 1 || data[0].vencidas === 0
                  ? "VENCIDAS"
                  : "VENCIDA"}
              </span>
            </div>
          </span>

          <span>{data[0].cerradas} CERRADAS</span>
        </div>
      ) : null}
    </Card>
  );
};

export default TaskHeader;
