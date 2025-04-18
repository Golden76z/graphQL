import { gql } from '@apollo/client';

export const FULL_STUDENT_STATS_QUERY = gql`
  query FullStudentStatsWithCompleteObjects {
    user {
      id
      login
      attrs
      auditRatio
      totalUp
      totalDown
      avatarUrl
      campus
      createdAt
      updatedAt
      
      public {
        firstName
        lastName
        profile
      }
      
      groups {
        id
        createdAt
        updatedAt
        group {
          id
          objectId
          eventId
          status
          path
          campus
          createdAt
          updatedAt
          captainId
          object {
            id
            name
            type
            attrs
          }
          event {
            id
            path
            createdAt
            endAt
          }
          members {
            user {
              id
              login
              avatarUrl
            }
          }
        }
      }
      
      events {
        id
        createdAt
        event {
          id
          createdAt
          endAt
          path
          object {
            id
            name
            type
            attrs
          }
          registrations {
            id
            startAt
            endAt
          }
        }
      }
      
      transactions(
        where: {type: {_eq: "xp"}}
        order_by: {createdAt: asc}
      ) {
        id
        type
        amount
        createdAt
        path
        campus
        object {
          id
          name
          type
          attrs
          parent: childrenRelation {
            parent {
              id
              name
              type
            }
          }
        }
        event {
          id
          path
        }
      }
      
      transactions_aggregate(where: {type: {_eq: "xp"}}) {
        aggregate {
          sum { amount }
          avg { amount }
          max { amount }
          count
        }
      }
      
      progresses(
        where: {isDone: {_eq: true}}
        order_by: {updatedAt: desc}
      ) {
        id
        grade
        createdAt
        updatedAt
        path
        version
        campus
        object {
          id
          name
          type
          attrs(path: "$")
          parent: childrenRelation {
            parent {
              id
              name
              type
            }
          }
        }
        group {
          id
          status
        }
        event {
          id
          path
        }
      }
      
      progresses_aggregate(where: {isDone: {_eq: true}}) {
        aggregate {
          count
          avg { grade }
          max { grade }
        }
      }
      
      audits {
        id
        grade
        createdAt
        updatedAt
        version
        group {
          id
          object {
            id
            name
            type
            attrs(path: "$.auditRequirements")
          }
        }
        auditor {
          id
          login
          avatarUrl
        }
      }
      
      audits_as_auditor: audits {
        id
        grade
        createdAt
        updatedAt
        group {
          id
          object {
            id
            name
            type
          }
          members {
            user {
              id
              login
            }
          }
        }
        auditor {
          id
          login
          avatarUrl
        }
      }

      
      audits_aggregate {
        aggregate {
          count
          sum { grade }
          avg { grade }
        }
      }
      
      results(
        order_by: [{updatedAt: desc}, {createdAt: desc}]
      ) {
        id
        grade
        type
        isLast
        createdAt
        updatedAt
        path
        version
        campus
        object {
          id
          name
          type
          attrs
          parent: childrenRelation {
            parent {
              id
              name
              type
            }
          }
        }
        group {
          id
          status
        }
        event {
          id
          path
        }
      }
      
      registrations {
        id
        createdAt
        registration {
          id
          startAt
          endAt
          object {
            id
            name
            type
            attrs
          }
          event {
            id
            path
          }
        }
      }
      
      matches {
        id
        createdAt
        updatedAt
        confirmed
        bet
        result
        path
        campus
        object {
          id
          name
          type
        }
        match_user: user {
          id
          login
        }
        event {
          id
          path
        }
      }
      
      user_roles {
        id
        role {
          id
          slug
          name
          description
        }
      }
      
      records {
        id
        message
        createdAt
        author {
          id
          login
        }
      }
      
      transactions_up: transactions(
        where: {type: {_eq: "up"}}
        order_by: {createdAt: desc}
      ) {
        id
        amount
        createdAt
        object {
          id
          name
        }
        relatedUser: user {
          id
          login
        }
      }
    }
  }
`;