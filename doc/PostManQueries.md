```json
{
  "query": "query FullStudentStatsWithAttrs { user { id login attrs auditRatio totalUp totalDown totalUpBonus avatarUrl campus createdAt public { firstName lastName profile } transactions_aggregate(where: {type: {_eq: \"xp\"}}) { aggregate { sum { amount } } } progresses_aggregate(where: {isDone: {_eq: true}}) { aggregate { count } } skills: progresses(where: {isDone: {_eq: true}}) { object { name type } updatedAt } audits_aggregate { aggregate { count } } xps { amount } } }"
}
```

