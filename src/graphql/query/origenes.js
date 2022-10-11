import { gql } from "@apollo/client";

export const GET_ORIGENES = gql`
  query getOrigenesResolver {
    getOrigenesResolver {
      ori_id
      ori_desc
    }
  }
`;
