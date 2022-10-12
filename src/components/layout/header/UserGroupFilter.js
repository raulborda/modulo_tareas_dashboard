import { Input, Select } from "antd";
import { TaskContext } from "../../../context/TaskContext";
import { useContext, useState } from "react";

const UserGroupFilter = ({ listadoGrupos, listadoUsuarios, filterEnable }) => {
  const { setIdUsuarioFiltro, idUser } = useContext(TaskContext);

  let usu_nombre = "";
  let usu_id = idUser;

  setIdUsuarioFiltro(usu_nombre)

  return (
    <>

      {listadoUsuarios &&
        listadoUsuarios.length > 0 &&
        listadoUsuarios.map((usuario) => {
          if (usuario.usu_id === idUser) {
            usu_nombre = usuario.usu_nombre;
            usu_id = usuario.usu_id;
            
          }
        })}

      <Input
        style={{ width: "200px", marginLeft: "8px" }}
        disabled={true}
        defaultValue={usu_nombre}
        placeholder={usu_id === idUser ? usu_nombre : null}
      />
    </>
  );
};

export default UserGroupFilter;
