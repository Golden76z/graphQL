import React from 'react';

export const PiscineStats = ({ piscines }) => {
  if (!piscines || Object.keys(piscines).length === 0) return null;

  return (
    <div className="piscine-stats">
      <h3>Piscines</h3>
      {Object.entries(piscines).map(([key, piscine]) => (
        <div key={key} className="piscine-section">
          <h4>{piscine.name}</h4>
          {piscine.startAt && piscine.endAt && (
            <p>Dates: {new Date(piscine.startAt).toLocaleDateString()} - {new Date(piscine.endAt).toLocaleDateString()}</p>
          )}
          <p>XP (excluding validation): {piscine.xp}</p>
          <p>Projects Completed: {piscine.progresses.length}</p>
          <p>Transactions: {piscine.transactions.length}</p>
          
          <div className="piscine-details">
            <h5>Recent Activities</h5>
            <ul>
              {piscine.transactions.slice(0, 5).map(tx => (
                <li key={tx.id}>
                  {tx.object?.name || 'Activity'}: {tx.amount} XP
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};