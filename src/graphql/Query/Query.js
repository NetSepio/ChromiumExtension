import { gql } from 'graphql-tag';

export const FETCH_REVIEWS = gql`
  query reviews($siteURL: String!) {
    reviews(where: { siteURL: $siteURL }) {
      category
      domainAddress
      siteType
      siteTag
      siteSafety
    }
  }
`;

export const FETCH_ROLE = gql`
  query user($id: String!) {
    user(id: $id) {
      roles
    }
  }
`;
