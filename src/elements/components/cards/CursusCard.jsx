import React from 'react';

export const CursusStats = ({ cursus }) => {
  if (!cursus) return null;

  const validationXpTotal = cursus.piscineValidations.reduce(
    (sum, tx) => sum + tx.amount, 0
  );

  const cursusXpWithoutValidations = cursus.xp - validationXpTotal;

  return (
    <div className="cursus-stats">
      <h3>Cursus</h3>
      <p>Total XP: {cursus.xp} (includes {validationXpTotal} XP from piscine validations)</p>
      <p>Base XP: {cursusXpWithoutValidations} (excluding validations)</p>
      <p>Projects Completed: {cursus.progresses.length}</p>
      <p>Audit Ratio: {cursus.auditRatio}</p>
      
      {validationXpTotal > 0 && (
        <div className="validation-xp">
          <h4>Piscine Validation XP</h4>
          <ul>
            {cursus.piscineValidations.map(tx => (
              <li key={tx.id}>
                {tx.object?.name || 'Validation'}: {tx.amount} XP
                {tx.createdAt && (
                  <span> ({new Date(tx.createdAt).toLocaleDateString()})</span>
                )}
              </li>
            ))}
          </ul>
          <p>Total Validation XP: {validationXpTotal}</p>
        </div>
      )}
    </div>
  );
};