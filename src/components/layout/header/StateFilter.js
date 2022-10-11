import { useQuery } from "@apollo/client";
import { Select } from "antd";
import { TaskContext } from "../../../context/TaskContext";
import { GET_ESTADOS_TAREAS } from "../../../graphql/query/estadosTareas";
import { useContext, useEffect, useState } from "react";

const StateFilter = ({ filterEnable }) => {
  const { setFilterState, viewMode } = useContext(TaskContext);
  const { data } = useQuery(GET_ESTADOS_TAREAS);
  const [estadosTareas, setEstadosTareas] = useState([]);

  useEffect(() => {
    if (data) {
      const dataEstados = data.getEstadosTareasIframeResolver;
      setEstadosTareas(JSON.parse(dataEstados));
    }
  }, [data]);

  return (
    <>
      {viewMode === "tableView" && (
        <Select
          disabled={filterEnable}
          style={{ width: "200px", marginLeft: 8 }}
          defaultValue={1}
          onChange={(v) => setFilterState(v)}
        >
          {estadosTareas &&
            estadosTareas.length > 0 &&
            estadosTareas.map((item) => {
              return (
                <Select.Option value={item.est_id} key={item.est_id}>
                  {item.est_desc}
                </Select.Option>
              );
            })}
        </Select>
      )}
    </>
  );
};

export default StateFilter;
