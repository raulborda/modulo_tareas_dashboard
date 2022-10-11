import {
  AreaChartOutlined,
  CalendarOutlined,
  FunnelPlotOutlined,
  MenuOutlined,
  PlusOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, Switch } from "antd";
import { TaskContext } from "../../../context/TaskContext";
import { GET_USUARIOS_Y_GRUPOS } from "../../../graphql/query/usuarios";
import { useContext, useEffect, useState } from "react";
import DateFilter from "./DateFilter";
import "./index.css";
import StateFilter from "./StateFilter";
import UserGroupFilter from "./UserGroupFilter";

const HeaderLayout = () => {
  const {
    setTaskDrawerVisible,
    idUser,
    setViewMode,
    filterEnable,
    setFilterEnable,
    setFilterIniciadas,
  } = useContext(TaskContext);

  const [listadoUsuarios, setListadoUsuarios] = useState([]);
  const [listadoGrupos, setListadoGrupos] = useState([]);
  const [usuarioNormal, setUsuarioNormal] = useState(false);

  const { data } = useQuery(GET_USUARIOS_Y_GRUPOS, {
    variables: { idUsuario: idUser },
  });

  useEffect(() => {
    if (data) {
      const dataUsuariosYGrupos = JSON.parse(
        data.getUsuariosGruposIframeResolver
      );

      if (dataUsuariosYGrupos) {
        setListadoGrupos(dataUsuariosYGrupos.listadoGrupos);
        setListadoUsuarios(dataUsuariosYGrupos.listadoUsuarios);
      } else {
        setUsuarioNormal(true);
      }
    }
  }, [data]);

  return (
    <div className="top-panel-wrapper">
      <h3>Header</h3>
      <div className="top-panel-buttons">
        <Switch
          onChange={(v) => {
            console.log(v);
            setFilterIniciadas(!v);
          }}
          checkedChildren={<UserAddOutlined />}
          unCheckedChildren={<UsergroupAddOutlined />}
          defaultChecked
        />

        <Switch
          style={{ marginLeft: "10px" }}
          onChange={(v) => {
            setFilterEnable(!v);
          }}
          checkedChildren={<FunnelPlotOutlined />}
          unCheckedChildren={<FunnelPlotOutlined />}
          defaultChecked
        />

        <DateFilter filterEnable={filterEnable} />
        <StateFilter filterEnable={filterEnable} />
        <UserGroupFilter
          listadoGrupos={listadoGrupos}
          listadoUsuarios={listadoUsuarios}
          filterEnable={usuarioNormal ? usuarioNormal : filterEnable}
        />

        <Button
          style={{ marginLeft: 8 }}
          onClick={() => setViewMode("tableView")}
          className="boton-iconos"
        >
          <MenuOutlined />
        </Button>

        <Button
          onClick={() =>
            setTaskDrawerVisible({ visible: true, content: "Mis Tareas" })
          }
          className="boton-iconos"
        >
          <CalendarOutlined />
        </Button>

        <Button
          onClick={() => setViewMode("graphView")}
          className="boton-iconos"
        >
          <AreaChartOutlined />
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 5 }}
          onClick={() =>
            setTaskDrawerVisible({ visible: true, content: "Nueva Tarea" })
          }
        >
          <PlusOutlined /> Tarea
        </Button>
      </div>
    </div>
  );
};

export default HeaderLayout;
