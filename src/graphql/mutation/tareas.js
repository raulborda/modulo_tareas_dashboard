const { gql } = require("@apollo/client");

export const NEW_TAREA = gql`
  mutation newTareaIframe(
    $inputTarea: tareaInput
    $inputNota: notaInput
    $inputAdjunto: uploadInput
    $usuAsig: Int
  ) {
    newTareaIframeResolver(
      inputTarea: $inputTarea
      inputNota: $inputNota
      inputAdjunto: $inputAdjunto
      usuAsig: $usuAsig
    )
  }
`;

export const UPDATE_ESTADO_TAREA = gql`
  mutation updateEstadoTareaIframeResolver($idTarea: Int) {
    updateEstadoTareaIframeResolver(idTarea: $idTarea)
  }
`;

export const UPDATE_TAREA = gql`
  mutation updateTarea(
    $idTarea: Int
    $inputTarea: tareaInput
    $inputAdjunto: uploadInput
    $inputNota: notaInput
    $idUsuario: Int
  ) {
    updateTareaResolver(
      idTarea: $idTarea
      inputTarea: $inputTarea
      inputAdjunto: $inputAdjunto
      inputNota: $inputNota
      idUsuario: $idUsuario
    )
  }
`;
