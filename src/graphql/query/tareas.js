const { gql } = require("@apollo/client");

export const GET_TAREAS = gql`
  query getTareasIframe(
    $idUsuario: Int
    $filtroFecha: String
    $fecha: String
    $estado: Int
    $idUsuarioFiltro: String
  ) {
    getTareasIframeResolver(
      idUsuario: $idUsuario
      filtroFecha: $filtroFecha
      fecha: $fecha
      estado: $estado
      idUsuarioFiltro: $idUsuarioFiltro
    )
  }
`;

export const GET_TAREAS_CALENDARIO = gql`
  query getTareasParaCalendarioIframeResolver($idUsuario: Int, $fecha: String) {
    getTareasParaCalendarioIframeResolver(idUsuario: $idUsuario, fecha: $fecha)
  }
`;

export const GET_TAREAS_DASHBOARD_IFRAME = gql`
  query getTareasDashboardIframe(
    $idUsuario: Int
    $filtroFecha: String
    $fecha: String
    $idUsuarioFiltro: String
  ) {
    getTareasDashboardIframeResolver(
      idUsuario: $idUsuario
      filtroFecha: $filtroFecha
      fecha: $fecha
      idUsuarioFiltro: $idUsuarioFiltro
    )
  }
`;
