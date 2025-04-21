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
    
    // Improved piscine detection - analyze all transactions first to find piscine types
    const piscineTypes = new Set();
    
    if (userData.transactions) {
      userData.transactions.forEach(tx => {
        const path = tx.path || "";
        const objectName = tx.object?.name || "";
        const objectType = tx.object?.type || "";
        
        // Look for piscine information in both path and object name
        if (objectType === "piscine" || 
            path.toLowerCase().includes("piscine") || 
            objectName.toLowerCase().includes("piscine")) {
          
          // Extract piscine type from path (e.g., /rouen/div-01/piscine-js -> JS)
          if (path.toLowerCase().includes("piscine")) {
            const pathParts = path.split("/");
            const piscinePart = pathParts.find(part => part.toLowerCase().includes("piscine-"));
            
            if (piscinePart) {
              const piscineType = piscinePart.replace("piscine-", "").toUpperCase();
              piscineTypes.add(`Piscine ${piscineType}`);
            }
          }
          
          // Extract from object name (e.g., "Piscine JS")
          if (objectName.toLowerCase().includes("piscine")) {
            piscineTypes.add(objectName);
          }
        }
      });
    }
    
    // Initialize piscine categories based on detected types
    piscineTypes.forEach(piscineType => {
      const piscineKey = piscineType.toLowerCase().replace(/\s+/g, '-');
      organized.piscines[piscineKey] = {
        name: piscineType,
        startAt: null,
        endAt: null,
        xp: 0,
        transactions: [],
        progresses: [],
        audits: [],
        results: [],
        groups: [],
        events: [],
        matches: []
      };
    });

    // Also check registrations to identify piscines
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
            } else {
              // Update start/end dates if already exists
              organized.piscines[piscineKey].startAt = reg.registration.startAt;
              organized.piscines[piscineKey].endAt = reg.registration.endAt;
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

    // Improved piscine matching function
    const findPiscineForTransaction = (piscines, transaction) => {
      const path = transaction.path || "";
      const objectName = transaction.object?.name || "";
      const objectType = transaction.object?.type || "";
      const eventPath = transaction.event?.path || "";
      
      // Check if this is a piscine validation (should be counted in cursus)
      if (objectName.toLowerCase().includes('piscine') && 
          objectType !== "exercise" && 
          !isPiscineValidation(transaction)) {
        return null; // Don't count as piscine XP
      }
      
      // Check event path first - most reliable indicator
      if (eventPath.toLowerCase().includes("piscine")) {
        const pathParts = eventPath.split("/");
        const piscinePart = pathParts.find(part => part.toLowerCase().includes("piscine-"));
        
        if (piscinePart) {
          const piscineType = `piscine ${piscinePart.replace("piscine-", "").toUpperCase()}`;
          
          for (const [key, piscine] of Object.entries(piscines)) {
            if (piscine.name.toLowerCase() === piscineType.toLowerCase()) {
              return key;
            }
          }
        }
      }
      
      // Direct match by object type being "piscine"
      if (objectType === "piscine") {
        for (const [key, piscine] of Object.entries(piscines)) {
          if (piscine.name.toLowerCase() === objectName.toLowerCase()) {
            return key;
          }
        }
      }
      
      // Match by path containing piscine identifier
      if (path.toLowerCase().includes("piscine")) {
        const pathParts = path.split("/");
        const piscinePart = pathParts.find(part => part.toLowerCase().includes("piscine-"));
        
        if (piscinePart) {
          const piscineType = `piscine ${piscinePart.replace("piscine-", "").toUpperCase()}`;
          
          for (const [key, piscine] of Object.entries(piscines)) {
            if (piscine.name.toLowerCase() === piscineType.toLowerCase()) {
              return key;
            }
          }
        }
      }
      
      return null;
    };

    // Process transactions
    if (userData.transactions) {
      userData.transactions.forEach(transaction => {
        // Update transaction date info to make it more useful
        // if (transaction.createdAt) {
        //   transaction.dateObject = new Date(transaction.createdAt);
        //   transaction.formattedDate = transaction.dateObject.toLocaleDateString();
        // }
        
        if (isPiscineValidation(transaction)) {
          organized.cursus.xp += transaction.amount;
          organized.cursus.piscineValidations.push(transaction);
        } else {
          const piscineKey = findPiscineForTransaction(organized.piscines, transaction);
          
          if (piscineKey) {
            organized.piscines[piscineKey].xp += transaction.amount;
            organized.piscines[piscineKey].transactions.push(transaction);
            
            // Update piscine date range based on transaction dates
            const txDate = new Date(transaction.createdAt);
            if (!organized.piscines[piscineKey].startAt || txDate < new Date(organized.piscines[piscineKey].startAt)) {
              organized.piscines[piscineKey].startAt = transaction.createdAt;
            }
            if (!organized.piscines[piscineKey].endAt || txDate > new Date(organized.piscines[piscineKey].endAt)) {
              organized.piscines[piscineKey].endAt = transaction.createdAt;
            }
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

    userData.transactions?.forEach(tx => {
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