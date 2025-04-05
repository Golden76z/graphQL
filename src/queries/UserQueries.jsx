import { gql } from '@apollo/client';

// Query to fetch user name information
export const GET_USER_INFO = gql`
  query GetUserInfo {
    user {
      lastName
      firstName
    }
  }
`;

// Query to fetch user level from events
export const GET_USER_LEVEL = gql`
  query GetUserLevel {
    user {
      events(where: {event: {path: {_ilike: "/rouen/div-01"}}}) {
        level
      }
    }
  }
`;

// Query to fetch all XP transactions
export const GET_USER_XP_TRANSACTIONS = gql`
  query GetUserXPTransactions {
    transaction(
      where: {type: {_eq: "xp"}, event: {path: {_ilike: "/rouen/div-01"}}}, 
      order_by: {id: asc}
    ) {
      amount
      createdAt
    }
  }
`;

// Query to get sum of "down" transactions
export const GET_XP_DOWN = gql`
  query GetXPDown {
    transaction_aggregate(
      where: {type: {_eq: "down"}, event: {path: {_ilike: "/rouen/div-01"}}}, 
      order_by: {id: asc}
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
`;

// Query to get sum of "up" transactions
export const GET_XP_UP = gql`
  query GetXPUp {
    transaction_aggregate(
      where: {type: {_eq: "up"}, event: {path: {_ilike: "/rouen/div-01"}}}, 
      order_by: {id: asc}
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
`;