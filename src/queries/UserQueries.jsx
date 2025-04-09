import { gql } from '@apollo/client';

export const TEST_QUERY = gql`
  query TestQuery {
    user {
      id
      login
    }
  }
`;

export const FULL_STUDENT_STATS_QUERY = gql`
  query FullStudentStatsWithAttrs {
    user {
      id
      login
      attrs
      auditRatio
      totalUp
      totalDown
      totalUpBonus
      avatarUrl
      campus
      createdAt
      public {
        firstName
        lastName
        profile
      }
      transactions_aggregate(where: {type: {_eq: "xp"}}) {
        aggregate {
          sum {
            amount
          }
        }
      }
      progresses_aggregate(where: {isDone: {_eq: true}}) {
        aggregate {
          count
        }
      }
      skills: progresses(where: {isDone: {_eq: true}}) {
        object {
          name
          type
        }
        updatedAt
      }
      audits_aggregate {
        aggregate {
          count
        }
      }
      xps {
        amount
      }
    }
  }
`;

export const extractUserData = (data) => {
  if (!data || !data.user) return null;
  
  const user = data.user;
  return {
    id: user.id,
    login: user.login,
    firstName: user.public?.firstName || '',
    lastName: user.public?.lastName || '',
    avatarUrl: user.avatarUrl,
    campus: user.campus,
    createdAt: user.createdAt,
    auditRatio: user.auditRatio,
    totalXP: user.transactions_aggregate?.aggregate?.sum?.amount || 0,
    totalProjects: user.progresses_aggregate?.aggregate?.count || 0,
    skills: user.skills?.map(skill => ({
      name: skill.object?.name,
      type: skill.object?.type,
      updatedAt: skill.updatedAt
    })) || [],
    totalAudits: user.audits_aggregate?.aggregate?.count || 0,
    profile: user.public?.profile || '',
    // Add other fields as needed
  };
};