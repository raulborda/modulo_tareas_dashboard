import { useQuery } from "@apollo/client";
import BodyLayout from "../layout/body/BodyLayout";
import HeaderLayout from "../layout/header/HeaderLayout";
import QueryResult from "../queryResult/QueryResult";
import TaskTable from "../table/TaskTable";
import { TaskContext } from "../../context/TaskContext";
import { GET_TAREAS } from "../../graphql/query/tareas";
import { useContext, useEffect, useState } from "react";
import moment from "moment";

const TableView = () => {
  const {
    idUser,
    filterDate,
    filterState,
    filterEnable,
    idUsuarioFiltro,
    filterIniciadas,
  } = useContext(TaskContext);
  const [tareas, setTareas] = useState([]);
  /*Estados de consulta */
  const [filtroFecha, setFiltroFecha] = useState(moment().format("YYYY-MM-DD"));

  //! Para gestionar el switch del filtro, opto por enviar string vacio y 0 en las vars de la query
  //! de esta manera evito tener que estar seteando states y perdiendo el valor anterior

  const {
    error,
    loading,
    data: dataTareas,
    startPolling,
    stopPolling,
  } = useQuery(GET_TAREAS, {
    fetchPolicy: "network-only",
    variables: {
      idUsuario: idUser,
      filtroFecha: filterEnable ? "" : filterDate.mode,
      fecha: filterEnable ? "" : filterDate.date,
      estado: filterEnable ? 0 : filterState,
      idUsuarioFiltro: idUsuarioFiltro,
    },
  });


  useEffect(() => {
    console.log("true");
    if (dataTareas) {
      console.log(JSON.parse(dataTareas.getTareasIframeResolver))
      const data = JSON.parse(dataTareas.getTareasIframeResolver);
      const tareasOrdenadas = data.tareas.sort((a,b) => {return b.tar_vencimiento.localeCompare(a.tar_vencimiento)} )
      console.log("tareasOrdenadas ", tareasOrdenadas)
      setTareas(tareasOrdenadas);
      // if (!filterIniciadas) {
      //   setTareas(data.tareas);
      // } else {
      //   setTareas(data.tareasIniciadas);
      // }
    }
  }, [idUser, dataTareas, filterEnable, idUsuarioFiltro, filterIniciadas]);

  return (
    <>
      <HeaderLayout />
      <QueryResult error={error} loading={loading} data={dataTareas}>
        <BodyLayout
          queryPoll={{ startPolling, stopPolling }}
          children={
            <TaskTable
              tareas={tareas}
              queryPoll={{ startPolling, stopPolling }}
            />
          }
        />
      </QueryResult>
    </>
  );
};

export default TableView;
