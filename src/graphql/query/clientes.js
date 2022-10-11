import { gql } from "@apollo/client";

export const GET_CLIENTES_LIMIT = gql`
  query getClientesLimit($input: String, $idUsuario: Int) {
    getClientesLimitResolver(input: $input, idUsuario: $idUsuario) {
      cli_nombre
      cli_id
      cli_idsistema
    }
  }
`;

export const GET_CONTACTOS = gql`
  query getContactos($id: Int) {
    getContactosResolver(id: $id) {
      con_id
      con_nombre
    }
  }
`;
