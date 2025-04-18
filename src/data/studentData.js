import { useQuery } from '@apollo/client';
import { FULL_STUDENT_STATS_QUERY } from './queriesData.js';

export const useStudentData = () => {
  const { loading, error, data } = useQuery(FULL_STUDENT_STATS_QUERY);
  
  const organizeData = (rawData) => {
    if (!rawData || !rawData.user || rawData.user.length === 0) return null;
    
    const userData = rawData.user[0];
    console.log("USER DATA: ", userData);
    
    const organized = {
      cursus: {
        xp: 0,
        transactions: [],
        piscineValidations: [],
        progresses: [],
        audits: [],
        results: [],
        groups: [],
        events: [],
        matches: [],
        totalUp: userData.totalUp,
        totalDown: userData.totalDown,
        auditRatio: userData.auditRatio
      },
      piscines: {},
      activityMap: []
    };

    // Add this after defining `userData`
    const userId = userData.id;

    // Process audits_as_auditor
    if (userData.audits_as_auditor) {
      const completedAudits = userData.audits_as_auditor
        .filter(
          (audit) => audit.auditor?.id === userId && audit.grade !== null
        )
        .sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    
      organized.cursus.audits = completedAudits.map((audit) => ({
        id: audit.id,
        grade: audit.grade,
        createdAt: audit.createdAt,
        updatedAt: audit.updatedAt,
        group: audit.group
      }));
    }
    

    // Process registrations to identify piscines
    if (userData.registrations) {
      userData.registrations.forEach(reg => {
        if (reg.registration?.object?.name) {
          const piscineName = reg.registration.object.name;
          if (piscineName.toLowerCase().includes('piscine')) {
            const piscineKey = piscineName.toLowerCase().replace(/\s+/g, '-');
            if (!organized.piscines[piscineKey]) {
              organized.piscines[piscineKey] = {
                name: piscineName,
                startAt: reg.registration.startAt,
                endAt: reg.registration.endAt,
                xp: 0,
                transactions: [],
                progresses: [],
                audits: [],
                results: [],
                groups: [],
                events: [],
                matches: []
              };
            }
          }
        }
      });
    }

    // Helper functions
    const isPiscineValidation = (transaction) => (
      transaction.object?.name?.toLowerCase().includes('piscine-validation') ||
      transaction.path?.toLowerCase().includes('piscine-validation')
    );

    const findPiscineForPathOrObject = (piscines, path, object) => {
      if (object?.name) {
        for (const [key, piscine] of Object.entries(piscines)) {
          if (object.name.toLowerCase().includes(piscine.name.toLowerCase())) {
            return key;
          }
        }
      }
      
      if (path) {
        for (const [key, piscine] of Object.entries(piscines)) {
          const piscinePathSegment = piscine.name.toLowerCase().replace('piscine', '').trim();
          if (path.toLowerCase().includes(`piscine-${piscinePathSegment}`)) {
            return key;
          }
        }
      }
      return null;
    };

    // Process transactions
    if (userData.transactions) {
      userData.transactions.forEach(transaction => {
        if (isPiscineValidation(transaction)) {
          organized.cursus.xp += transaction.amount;
          organized.cursus.piscineValidations.push(transaction);
        } else {
          const piscineMatch = findPiscineForPathOrObject(
            organized.piscines,
            transaction.path,
            transaction.object
          );
          
          if (piscineMatch) {
            organized.piscines[piscineMatch].xp += transaction.amount;
            organized.piscines[piscineMatch].transactions.push(transaction);
          } else {
            organized.cursus.xp += transaction.amount;
            organized.cursus.transactions.push(transaction);
          }
        }
      });
    }

    // Create activity map
    const activityData = {};
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        activityData[dateStr] = 0;
    }

    userData.transactions.forEach(tx => {
      if (tx.createdAt) {
        const dateStr = tx.createdAt.split('T')[0];
        if (activityData[dateStr] !== undefined) {
          activityData[dateStr]++;
        }
      }
    });

    organized.activityMap = Object.entries(activityData).map(([date, count]) => ({
      date,
      count
    }));

    return organized;
  };

  return {
    loading,
    error,
    data: organizeData(data),
    rawData: data
  };
};