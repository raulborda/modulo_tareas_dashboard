import { gql } from "@apollo/client";

export const GET_USUARIOS = gql`
  query getUsuarios($input: String) {
    getUsuariosResolver(input: $input) {
      usu_id
      usu_nombre
    }
  }
`;

export const GET_USUARIOS_Y_GRUPOS = gql`
  query Query($idUsuario: Int) {
    getUsuariosGruposIframeResolver(idUsuario: $idUsuario)
  }
`;
