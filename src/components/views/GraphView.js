/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@apollo/client";
import BodyLayout from "../layout/body/BodyLayout";
import HeaderLayout from "../layout/header/HeaderLayout";
import QueryResult from "../queryResult/QueryResult";
import TaskDashboard from "../taskDashboard/TaskDashboard";
import { TaskContext } from "../../context/TaskContext";
import { GET_TAREAS_DASHBOARD_IFRAME } from "../../graphql/query/tareas";
import { useContext, useEffect, useState } from "react";

const GraphView = () => {
  const [table, setTable] = useState([]);
  const [graph, setGraph] = useState([]);
  const [totales, setTotales] = useState([]);

  const { idUser, filterDate, filterEnable, idUsuarioFiltro } =
    useContext(TaskContext);

  const { data, loading, error } = useQuery(GET_TAREAS_DASHBOARD_IFRAME, {
    variables: {
      idUsuario: idUser,
      filtroFecha: filterEnable ? "" : filterDate.mode,
      fecha: filterEnable ? "" : filterDate.date,
      idUsuarioFiltro: idUsuarioFiltro,
    },
  });

  useEffect(() => {
    if (data) {
      const Table = JSON.parse(
        data.getTareasDashboardIframeResolver
      ).dataPorEstado;
      const Graph = JSON.parse(data.getTareasDashboardIframeResolver).dataTorta;

      const graphData = Graph.map((item, idx) => {
        return {
          name: item.tip_desc,
          vigentes: item.vigentes,
          vencidas: item.vencidas,
          totalPorBarra: item.vencidas + item.vigentes,
        };
      });
      setGraph(graphData);

      const Totales = JSON.parse(
        data.getTareasDashboardIframeResolver
      ).dataTotales;
      const tab = Table.map((item) => {
        return {
          ...item,
          key: item.usu_id,
        };
      });
      setTable(tab);
      setTotales(Totales);
    }
  }, [data]);

  return (
    <>
      <HeaderLayout />
      <QueryResult error={error} loading={loading} data={data}>
        <BodyLayout
          children={
            <TaskDashboard
              dataGraph={graph}
              dataTable={table}
              dataTotales={totales}
            />
          }
        />
      </QueryResult>
    </>
  );
};

export default GraphView;
