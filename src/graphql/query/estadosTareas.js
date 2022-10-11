const { gql } = require("@apollo/client");

export const GET_ESTADOS_TAREAS = gql`
  query getEstadosTareasIframe {
    getEstadosTareasIframeResolver
  }
`;
