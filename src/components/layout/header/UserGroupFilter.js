import { Select } from "antd";
import { TaskContext } from "../../../context/TaskContext";
import { useContext } from "react";

const UserGroupFilter = ({ listadoGrupos, listadoUsuarios, filterEnable }) => {
  const { setIdUsuarioFiltro } = useContext(TaskContext);

  return (
    <Select
      disabled={filterEnable}
      placeholder={"Grupo o usuario"}
      style={{ width: "200px", marginLeft: 8 }}
      allowClear
      onChange={(v) => {
        setIdUsuarioFiltro(v);
      }}
    >
      {listadoGrupos &&
        listadoGrupos.length > 0 &&
        listadoGrupos.map((grupo) => {
          return (
            <Select.Option key={`g${grupo.gru_id}`} value={`g${grupo.gru_id}`}>
              <strong>{grupo.gru_nombre}</strong>
            </Select.Option>
          );
        })}

      {listadoUsuarios &&
        listadoUsuarios.length > 0 &&
        listadoUsuarios.map((usuario) => {
          return (
            <Select.Option
              key={`u${usuario.usu_id}`}
              value={`u${usuario.usu_id}`}
            >
              {usuario.usu_nombre}
            </Select.Option>
          );
        })}
    </Select>
  );
};

export default UserGroupFilter;
