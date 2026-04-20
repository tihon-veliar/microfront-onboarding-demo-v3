export const GET_CREATURE_BY_SLUG_QUERY = /* GraphQL */ `
  query GetCreatureBySlug($slug: String!) {
    creatureCollection(limit: 1, where: { slug: $slug }) {
      items {
        sys {
          id
        }
        name
        slug
        shortDescription {
          json
        }
        description {
          json
        }
        coverImage {
          title
          description
          url
          width
          height
        }
        creatureIndex
        height
        weight
        abilities
        externalResourceLink
        rating
        taxonomiesCollection(limit: 20) {
          items {
            sys {
              id
            }
          }
        }
      }
    }
  }
`;

// export const GET_CREATURE_BY_SLUG_QUERY = /* GraphQL */ `
//   query GetCreatureBySlug($slug: String!) {
//     creatureCollection(limit: 1, where: { slug: $slug }) {
//       items {
//         sys {
//           id
//         }
//         name
//         slug
//       }
//     }
//   }
// `;
