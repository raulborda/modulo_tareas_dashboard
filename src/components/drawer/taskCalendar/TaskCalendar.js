/* eslint-disable array-callback-return */
import { CheckOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Badge, Calendar, List, Popconfirm, Tag } from "antd";
import QueryResult from "../../queryResult/QueryResult";
import { TaskContext } from "../../../context/TaskContext";
import { UPDATE_ESTADO_TAREA } from "../../../graphql/mutation/tareas";
import { GET_TAREAS_CALENDARIO } from "../../../graphql/query/tareas";
import moment from "moment";
import { Fragment, useContext, useEffect, useState } from "react";
import OpenNotification from "../../notification/OpenNotification";
import "./index.css";

const TaskCalendar = ({ queryPoll }) => {
  const { idUser } = useContext(TaskContext);
  const [ownTasks, setOwnTasks] = useState([]);
  const [tasksDates, setTasksDates] = useState([]);
  const [filterDate, setFilterDate] = useState(moment().format("YYYY-MM-DD"));
  const [horasParaIterar, setHorasParaIterar] = useState([]);
  const [clientesParaIterar, setClientesParaIterar] = useState([]);

  const [updateEstadoTareaIframeResolver] = useMutation(UPDATE_ESTADO_TAREA);

  const { startPolling, stopPolling } = queryPoll;

  const {
    data,
    error,
    loading,
    startPolling: startPollingLocal,
    stopPolling: stopPollingLocal,
  } = useQuery(GET_TAREAS_CALENDARIO, {
    variables: { idUsuario: idUser, fecha: filterDate },
  });

  useEffect(() => {
    if (data) {
      const tareas = JSON.parse(data.getTareasParaCalendarioIframeResolver);

      console.log(tareas.data);
      setTasksDates(tareas.fechasVenc);
      setOwnTasks(tareas.data);

      const horasVto = tareas.data.map((item) => {
        return item.tar_horavencimiento;
      });

      const horasSinRepetir = Array.from(new Set([...horasVto]));
      setHorasParaIterar(horasSinRepetir);

      const clientes = tareas.data.map((item) => {
        return {
          cli_nombre: item.cli_nombre,
          horaVto: item.tar_horavencimiento,
        };
      });

      const clientesSinRepetir = Array.from(new Set([...clientes]));

      setClientesParaIterar(clientesSinRepetir);
    }
  }, [data, filterDate]);

  const confirm = (item) => {
    updateEstadoTareaIframeResolver({
      variables: { idTarea: item.tar_id },
    }).then((res) => {
      const { data } = res;
      const resp = JSON.parse(data.updateEstadoTareaIframeResolver);

      startPolling(1000);
      startPollingLocal(1000);
      setTimeout(() => {
        stopPollingLocal();
        stopPolling();
      }, 1000);

      OpenNotification(
        <h4>{resp.response}</h4>,
        null,
        "topleft",
        <CheckOutlined style={{ color: "green" }} />,
        null
      );
    });
  };

  const getListData = (value) => {
    let listData = [];

    const existeTarea = tasksDates.filter((item) => {
      return item.tar_vencimiento === moment(value).format("YYYY-MM-DD");
    });

    if (existeTarea.length > 0) {
      listData = [
        {
          type: "1",
        },
      ];
    } else {
      listData = [
        {
          type: "0",
        },
      ];
    }

    return listData;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);

    return (
      <span>
        {listData.map((item, idx) => {
          return (
            <Badge
              key={idx}
              size="small"
              dot={true}
              color={item.type === "1" ? "green" : "white"}
            />
          );
        })}
      </span>
    );
  };

  return (
    <>
      <div className="div_contenedor">
        <Calendar
          className="cccc"
          dateCellRender={dateCellRender}
          fullscreen={false}
          onChange={(v) => setFilterDate(moment(v).format("YYYY-MM-DD"))}
        />
        <QueryResult error={error} loading={loading} data={ownTasks}>
          {horasParaIterar &&
            horasParaIterar.map((hora, idx) => {
              return (
                <List
                  header={
                    <h4>
                      <strong>{hora && hora.slice(0, 5)}</strong>
                    </h4>
                  }
                  key={idx}
                >
                  {clientesParaIterar &&
                    clientesParaIterar.map((clientes, index) => {
                      if (clientes.horaVto === hora) {
                        return (
                          <Fragment key={index}>
                            <h4>{clientes.cli_nombre}</h4>
                            {ownTasks.map((tarea) => {
                              let tagColor = "";
                              switch (true) {
                                case tarea.pri_id === 1:
                                  tagColor = "red";
                                  break;
                                case tarea.pri_id === 2:
                                  tagColor = "gold";
                                  break;
                                case tarea.pri_id === 3:
                                  tagColor = "green";
                                  break;
                                default:
                                  break;
                              }
                              if (
                                tarea.cli_nombre === clientes.cli_nombre &&
                                tarea.tar_horavencimiento === hora
                              ) {
                                return (
                                  <div
                                    className="task-wrapper"
                                    key={index + tarea.cli_nombre}
                                  >
                                    <div className="task-detail">
                                      <Tag
                                        style={{ marginLeft: "10px" }}
                                        color={tagColor}
                                      >
                                        {tarea.pri_desc}
                                      </Tag>

                                      <Tag
                                        style={{ marginLeft: "10px" }}
                                        color={tarea.ori_color}
                                      >
                                        {tarea.ori_desc}
                                      </Tag>
                                      <span>{tarea.tar_asunto}</span>
                                    </div>
                                    <span>
                                      <Popconfirm
                                        placement="topLeft"
                                        title="¿Desea completar la tarea?"
                                        okText="Si"
                                        cancelText="No"
                                        onConfirm={() => confirm(tarea)}
                                      >
                                        <CheckOutlined
                                          style={{
                                            fontSize: "12px",
                                            color: "green",
                                          }}
                                        />
                                      </Popconfirm>
                                    </span>
                                  </div>
                                );
                              }
                            })}
                          </Fragment>
                        );
                      }
                    })}
                </List>
              );
            })}
        </QueryResult>
      </div>
    </>
  );
};

export default TaskCalendar;
