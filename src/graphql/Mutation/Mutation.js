import { gql } from '@apollo/client';

export const CREATE_COMMENT = gql`
  mutation createReview(
    $category: String!
    $domainAddress: String!
    $siteUrl: String!
    $siteType: String!
    $siteTag: String!
    $siteSafety: String!
    $metaDataUri: String!
    $voter: String!
  ) {
    createReview(
      Review: {
        category: $category
        domainAddress: $domainAddress
        siteUrl: $siteUrl
        siteType: $siteType
        siteTag: $siteTag
        siteSafety: $siteSafety
        metaDataUri: $metaDataUri
        voter: $voter
      }
    ) {
      roles
      reviews
    }
  }
`;
