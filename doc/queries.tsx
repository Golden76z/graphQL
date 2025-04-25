import { gql } from "@apollo/client"

// All xp gains on the cursus
const GetAllXPGains = gql`
    query GetUserDetailedXp {
        transaction(
            where: {
            type: {_eq: "xp"},
            path: {_niregex: "/(piscine-[^/]+/)"}
            },
            order_by: {createdAt: desc}
        ) {
            id
            type
            amount
            createdAt
            path
            objectId
        }
    }
`

// Piscine xp stats
const GetPiscineStats = gql`
    query GetXpStats {
    piscineGoXp: transaction_aggregate(where: {
        type: { _eq: "xp" },
        path: { _like: "%piscine-go%" }
    }) {
        aggregate {
            sum {
                amount
            }
        }
    }
    
    piscineJsXp: transaction_aggregate(where: {
        type: { _eq: "xp" },
        path: { _like: "%piscine-js/%" }
    }) {
        aggregate {
            sum {
                amount
            }
        }
    }
    
    cursusXp: transaction_aggregate(where: {
        type: { _eq: "xp" },
        _or: [
        { 
            path: { _like: "%div-01%" },
            _not: { path: { _like: "%piscine%" } } 
        },
        {
            path: { _like: "%div-01/piscine-js" },
            _not: { path: { _like: "%piscine-js/%" } }
        }
        ]
    }) {
        aggregate {
            sum {
                amount
            }
        }
    }
    }
`

const PiscineXpWithDetails = gql`
    query GetXpStatsWithDetails {
    # Piscine Go - Aggregate
    piscineGoXpAggregate: transaction_aggregate(
        where: {
        type: { _eq: "xp" },
        path: { _like: "%piscine-go%" }
        }
    ) {
        aggregate {
            sum {
                amount
            }
        }
    }
    
    # Piscine Go - Detailed transactions
    piscineGoXpDetails: transaction(
        where: {
        type: { _eq: "xp" },
        path: { _like: "%piscine-go%" }
        },
        order_by: { createdAt: asc }
    ) {
        amount
        createdAt
        path
    }
    
    # Piscine JS - Aggregate
    piscineJsXpAggregate: transaction_aggregate(
        where: {
        type: { _eq: "xp" },
        path: { _like: "%piscine-js/%" }
        }
    ) {
        aggregate {
            sum {
                amount
            }
        }
    }
    
    # Piscine JS - Detailed transactions
    piscineJsXpDetails: transaction(
        where: {
        type: { _eq: "xp" },
        path: { _like: "%piscine-js/%" }
        },
        order_by: { createdAt: asc }
    ) {
        amount
        createdAt
        path
    }
    
    # Cursus - Aggregate
    cursusXpAggregate: transaction_aggregate(
        where: {
        type: { _eq: "xp" },
        _or: [
            { 
            path: { _like: "%div-01%" },
            _not: { path: { _like: "%piscine%" } } 
            },
            {
            path: { _like: "%div-01/piscine-js" },
            _not: { path: { _like: "%piscine-js/%" } }
            }
        ]
        }
    ) {
        aggregate {
            sum {
                amount
            }
        }
    }
    
    # Cursus - Detailed transactions
    cursusXpDetails: transaction(
        where: {
        type: { _eq: "xp" },
        _or: [
            { 
            path: { _like: "%div-01%" },
            _not: { path: { _like: "%piscine%" } } 
            },
            {
            path: { _like: "%div-01/piscine-js" },
            _not: { path: { _like: "%piscine-js/%" } }
            }
        ]
        },
        order_by: { createdAt: asc }
    ) {
        amount
        createdAt
        path
    }
    }
`

// Amount of every skills
const SkillsAmounts = gql`
    query GetSkills {
        user {
            transactions(
            where: {
                _and: [
                { type: { _neq: "xp" } },
                { type: { _neq: "level" } }
                { type: { _neq: "up" } }
                { type: { _neq: "down" } }
                ]
            }
            order_by: { createdAt: asc }
            ) {
                type
                amount
            }
        }
    }
`

// Group members that you worked with
const BestFriendQuery = gql`
    query GetBestFriend {
        user {
            # Group participation
            groups {
                id
                createdAt   
                group {
                    object {
                        type
                    }
                        captainId
                        members {
                        user {
                            login
                        }
                    }
                }
            }
        }
    }
`

// All audits, completed or not
const AllAuditQuery = gql`
    query GetAudits {
        user {
            audits_as_auditor: audits(order_by: {createdAt: desc}) {
                createdAt
                grade
                group {
                    object {
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
            }
        }
    }
`

// All activity transactions (! exams transactions are counted in)
const GithubLikeActivityQuery = gql`
    query GetActivity {
        user {
            progresses(
                order_by: {createdAt: desc}
            ) {
                createdAt
            }
        }
    }
`