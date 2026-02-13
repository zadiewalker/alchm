# Firestore Optimization Guide

## 1. Deploy Indexes

Deploy the optimized indexes to Firebase:

```bash
firebase deploy --only firestore:indexes
```

## 2. Query Optimization Patterns

### A. Journal Entries - Optimized Queries

```typescript
// ✅ GOOD - Uses composite index (userId + timestamp)
const getUserJournalEntries = async (userId: string, limit = 20) => {
  const q = query(
    collection(db, 'journal-entries'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limit)
  );
  return await getDocs(q);
};

// ✅ GOOD - Uses composite index (userId + mood + timestamp)  
const getUserEntriesByMood = async (userId: string, mood: string) => {
  const q = query(
    collection(db, 'journal-entries'),
    where('userId', '==', userId),
    where('mood', '==', mood),
    orderBy('timestamp', 'desc'),
    limit(10)
  );
  return await getDocs(q);
};

// ✅ GOOD - Uses array-contains index
const getEntriesByEmotion = async (userId: string, emotion: string) => {
  const q = query(
    collection(db, 'journal-entries'),
    where('userId', '==', userId),
    where('emotions', 'array-contains', emotion),
    orderBy('timestamp', 'desc')
  );
  return await getDocs(q);
};
```

### B. Crisis Monitoring - Optimized Queries

```typescript
// ✅ GOOD - Uses composite index (confidenceLevel + timestamp)
const getHighConfidenceCrises = async () => {
  const q = query(
    collection(db, 'crisisEvents'),
    where('confidenceLevel', '==', 'high'),
    orderBy('timestamp', 'desc'),
    limit(50)
  );
  return await getDocs(q);
};

// ✅ GOOD - Uses composite index (resolved + timestamp)
const getUnresolvedCrises = async () => {
  const q = query(
    collection(db, 'crisisEvents'),
    where('resolved', '==', false),
    orderBy('timestamp', 'desc')
  );
  return await getDocs(q);
};
```

### C. Cost Monitoring - Optimized Queries

```typescript
// ✅ GOOD - Uses composite index (userId + date)
const getUserDailyUsage = async (userId: string, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const dateString = startDate.toISOString().split('T')[0];
  
  const q = query(
    collection(db, 'userUsage'),
    where('userId', '==', userId),
    where('date', '>=', dateString),
    orderBy('date', 'desc')
  );
  return await getDocs(q);
};

// ✅ GOOD - Uses composite index (date + totalCostUSD)
const getHighCostDays = async () => {
  const q = query(
    collection(db, 'dailyCostSummary'),
    where('totalCostUSD', '>', 10),
    orderBy('totalCostUSD', 'desc'),
    limit(10)
  );
  return await getDocs(q);
};
```

## 3. Pagination Best Practices

```typescript
// ✅ GOOD - Cursor-based pagination
export class OptimizedPagination<T> {
  private lastDoc: DocumentSnapshot | null = null;
  private pageSize: number;
  
  constructor(pageSize = 20) {
    this.pageSize = pageSize;
  }
  
  async getFirstPage(baseQuery: Query): Promise<{ docs: T[], hasMore: boolean }> {
    const q = query(baseQuery, limit(this.pageSize + 1));
    const snapshot = await getDocs(q);
    
    const docs = snapshot.docs.slice(0, this.pageSize);
    const hasMore = snapshot.docs.length > this.pageSize;
    
    if (docs.length > 0) {
      this.lastDoc = docs[docs.length - 1];
    }
    
    return {
      docs: docs.map(doc => ({ id: doc.id, ...doc.data() } as T)),
      hasMore
    };
  }
  
  async getNextPage(baseQuery: Query): Promise<{ docs: T[], hasMore: boolean }> {
    if (!this.lastDoc) {
      return { docs: [], hasMore: false };
    }
    
    const q = query(baseQuery, startAfter(this.lastDoc), limit(this.pageSize + 1));
    const snapshot = await getDocs(q);
    
    const docs = snapshot.docs.slice(0, this.pageSize);
    const hasMore = snapshot.docs.length > this.pageSize;
    
    if (docs.length > 0) {
      this.lastDoc = docs[docs.length - 1];
    }
    
    return {
      docs: docs.map(doc => ({ id: doc.id, ...doc.data() } as T)),
      hasMore
    };
  }
}
```

## 4. Query Performance Monitoring

```typescript
// Query performance tracker
export class QueryPerformanceTracker {
  static async trackQuery<T>(
    queryName: string, 
    queryFn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await queryFn();
      const duration = Date.now() - startTime;
      
      // Log slow queries
      if (duration > 1000) { // Queries taking > 1 second
        console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
        
        // Send to monitoring
        Sentry.addBreadcrumb({
          message: `Slow Firestore query: ${queryName}`,
          category: 'query-performance',
          data: { queryName, duration },
          level: 'warning',
        });
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`Query failed: ${queryName} after ${duration}ms`, error);
      throw error;
    }
  }
}

// Usage example
const journalEntries = await QueryPerformanceTracker.trackQuery(
  'getUserJournalEntries',
  () => getUserJournalEntries(userId)
);
```

## 5. Data Archiving Strategy

```typescript
// Automatic data archiving
export const archiveOldData = functions.pubsub.schedule('0 3 1 * *') // Monthly
  .onRun(async () => {
    const db = admin.firestore();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // Archive old journal entries
    const oldEntriesQuery = db.collection('journal-entries')
      .where('timestamp', '<', sixMonthsAgo)
      .limit(1000);
    
    const snapshot = await oldEntriesQuery.get();
    
    if (!snapshot.empty) {
      const batch = db.batch();
      
      snapshot.docs.forEach(doc => {
        // Move to archive collection
        batch.set(
          db.collection('archived-journal-entries').doc(doc.id),
          { ...doc.data(), archivedAt: admin.firestore.FieldValue.serverTimestamp() }
        );
        // Delete from main collection
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Archived ${snapshot.size} old journal entries`);
    }
  });
```

## 6. Cost Optimization

### Read/Write Cost Minimization

```typescript
// ✅ GOOD - Batch writes
export const batchWriteOptimized = async (updates: Array<{
  collection: string;
  doc: string;
  data: any;
}>) => {
  const db = getFirestore();
  const batch = writeBatch(db);
  
  updates.forEach(({ collection: collName, doc: docId, data }) => {
    const docRef = doc(db, collName, docId);
    batch.set(docRef, data, { merge: true });
  });
  
  return await batch.commit(); // Single write operation
};

// ✅ GOOD - Efficient aggregations
export const getAggregatedStats = async (userId: string) => {
  // Use single query instead of multiple reads
  const q = query(
    collection(db, 'userUsage'),
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(30)
  );
  
  const snapshot = await getDocs(q);
  
  // Calculate aggregations client-side to minimize reads
  return snapshot.docs.reduce((acc, doc) => {
    const data = doc.data();
    acc.totalCost += data.costUSD || 0;
    acc.totalTokens += data.tokenCount || 0;
    acc.totalRequests += data.requestCount || 0;
    return acc;
  }, { totalCost: 0, totalTokens: 0, totalRequests: 0 });
};
```

## 7. Real-time Listeners Optimization

```typescript
// ✅ GOOD - Efficient real-time updates
export const createOptimizedListener = (
  userId: string,
  callback: (entries: JournalEntry[]) => void
) => {
  const q = query(
    collection(db, 'journal-entries'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(10) // Limit real-time updates
  );
  
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as JournalEntry));
    
    callback(entries);
  });
};

// ✅ GOOD - Cleanup listeners
export const useOptimizedFirestoreQuery = (userId: string) => {
  const [data, setData] = useState<JournalEntry[]>([]);
  
  useEffect(() => {
    if (!userId) return;
    
    const unsubscribe = createOptimizedListener(userId, setData);
    
    // Cleanup on unmount
    return () => unsubscribe();
  }, [userId]);
  
  return data;
};
```

## 8. Index Deployment Commands

```bash
# Deploy all indexes
firebase deploy --only firestore:indexes

# Deploy specific index
firebase deploy --only firestore:indexes --force

# Check index status
firebase firestore:indexes

# Delete unused indexes
firebase firestore:indexes:delete <index-id>
```

This optimization strategy will significantly improve query performance and reduce costs as you scale to thousands of users.