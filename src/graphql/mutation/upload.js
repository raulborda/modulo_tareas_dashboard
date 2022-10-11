const { gql } = require("@apollo/client");

export const DELETE_UPLOAD_TAREA = gql`
  mutation deleteUploadDeTareaIframeResolver($idTarea: Int) {
    deleteUploadDeTareaIframeResolver(idTarea: $idTarea)
  }
`;
