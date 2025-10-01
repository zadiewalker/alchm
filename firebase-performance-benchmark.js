#!/usr/bin/env node

/**
 * FIREBASE SERVICE PERFORMANCE BENCHMARK FOR ALCHM
 * 
 * Tests Firebase service response times critical for mental health app
 * Targets: Firestore <500ms, Auth <1s, Functions <2s
 */

const { performance } = require('perf_hooks');
const fs = require('fs').promises;
const path = require('path');

class FirebasePerformanceBenchmark {
  constructor() {
    this.results = {
      auth: {},
      firestore: {},
      functions: {},
      summary: {},
      criticalIssues: []
    };
    this.testData = [];
  }

  async benchmark() {
    console.log('🔥 ALCHM Firebase Performance Benchmark');
    console.log('⚡ Mental Health App - Service Speed Critical');
    console.log('='.repeat(50));

    try {
      await this.testAuthPerformance();
      await this.testFirestorePerformance();
      await this.testFunctionsPerformance();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Benchmark failed:', error);
      this.results.criticalIssues.push({
        type: 'BENCHMARK_FAILURE',
        message: error.message,
        impact: 'CRITICAL'
      });
    }
  }

  async testAuthPerformance() {
    console.log('\n🔐 Testing Firebase Auth Performance...');

    try {
      const authTest = `
const { initializeApp } = require('firebase/app');
const { getAuth, onAuthStateChanged } = require('firebase/auth');

async function benchmarkAuth() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

  const results = [];
  
  // Test 5 auth initializations
  for (let i = 0; i < 5; i++) {
    const startTime = Date.now();
    
    try {
      const app = initializeApp(config, \`app-\${i}\`);
      const auth = getAuth(app);
      
      await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          const duration = Date.now() - startTime;
          results.push({
            test: i + 1,
            duration,
            success: true,
            user: !!user
          });
          resolve();
        });
        
        // Timeout after 3 seconds
        setTimeout(() => {
          results.push({
            test: i + 1,
            duration: Date.now() - startTime,
            success: false,
            error: 'Timeout'
          });
          resolve();
        }, 3000);
      });
      
    } catch (error) {
      results.push({
        test: i + 1,
        duration: Date.now() - startTime,
        success: false,
        error: error.message
      });
    }
  }
  
  console.log(JSON.stringify(results, null, 2));
}

benchmarkAuth().catch(console.error);
`;

      // Run auth benchmark
      const results = await this.runNodeTest(authTest, 'auth-benchmark');
      
      if (results.length > 0) {
        const successfulTests = results.filter(r => r.success);
        const avgDuration = successfulTests.length > 0 
          ? successfulTests.reduce((sum, r) => sum + r.duration, 0) / successfulTests.length 
          : 0;
        const maxDuration = successfulTests.length > 0 
          ? Math.max(...successfulTests.map(r => r.duration)) 
          : 0;

        this.results.auth = {
          totalTests: results.length,
          successfulTests: successfulTests.length,
          averageDuration: avgDuration,
          maxDuration: maxDuration,
          target: 1000, // 1 second target
          meetsTarget: avgDuration < 1000,
          results: results
        };

        console.log(`   ⚡ Average auth time: ${avgDuration.toFixed(0)}ms (target: <1000ms)`);
        console.log(`   🎯 Max auth time: ${maxDuration}ms`);
        console.log(`   ✅ Success rate: ${successfulTests.length}/${results.length}`);

        if (avgDuration >= 1000) {
          this.results.criticalIssues.push({
            type: 'AUTH_SLOW',
            message: `Firebase Auth averaging ${avgDuration.toFixed(0)}ms (target: <1000ms)`,
            impact: 'HIGH'
          });
        }

        if (maxDuration >= 2000) {
          this.results.criticalIssues.push({
            type: 'AUTH_VERY_SLOW',
            message: `Firebase Auth max time ${maxDuration}ms (critical threshold: 2000ms)`,
            impact: 'CRITICAL'
          });
        }
      } else {
        console.log('   ❌ No auth benchmark results');
        this.results.criticalIssues.push({
          type: 'AUTH_BENCHMARK_FAILED',
          message: 'Firebase Auth benchmark returned no results',
          impact: 'HIGH'
        });
      }

    } catch (error) {
      console.error('❌ Auth benchmark failed:', error.message);
      this.results.criticalIssues.push({
        type: 'AUTH_BENCHMARK_ERROR',
        message: error.message,
        impact: 'HIGH'
      });
    }
  }

  async testFirestorePerformance() {
    console.log('\n🗄️ Testing Firestore Performance...');

    try {
      const firestoreTest = `
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, query, limit, getDocs } = require('firebase/firestore');

async function benchmarkFirestore() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

  const results = [];
  
  try {
    const app = initializeApp(config, 'firestore-bench');
    const db = getFirestore(app);
    
    // Test simple document read
    for (let i = 0; i < 3; i++) {
      const startTime = Date.now();
      
      try {
        const docRef = doc(db, 'test', 'performance');
        await getDoc(docRef);
        
        const duration = Date.now() - startTime;
        results.push({
          test: 'doc-read',
          attempt: i + 1,
          duration,
          success: true
        });
      } catch (error) {
        results.push({
          test: 'doc-read',
          attempt: i + 1,
          duration: Date.now() - startTime,
          success: false,
          error: error.message
        });
      }
    }
    
    // Test collection query
    for (let i = 0; i < 2; i++) {
      const startTime = Date.now();
      
      try {
        const q = query(collection(db, 'journals'), limit(5));
        await getDocs(q);
        
        const duration = Date.now() - startTime;
        results.push({
          test: 'collection-query',
          attempt: i + 1,
          duration,
          success: true
        });
      } catch (error) {
        results.push({
          test: 'collection-query',
          attempt: i + 1,
          duration: Date.now() - startTime,
          success: false,
          error: error.message
        });
      }
    }
    
  } catch (error) {
    results.push({
      test: 'initialization',
      duration: 0,
      success: false,
      error: error.message
    });
  }
  
  console.log(JSON.stringify(results, null, 2));
}

benchmarkFirestore().catch(console.error);
`;

      const results = await this.runNodeTest(firestoreTest, 'firestore-benchmark');
      
      if (results.length > 0) {
        const docReads = results.filter(r => r.test === 'doc-read' && r.success);
        const queries = results.filter(r => r.test === 'collection-query' && r.success);
        
        const avgDocRead = docReads.length > 0 
          ? docReads.reduce((sum, r) => sum + r.duration, 0) / docReads.length 
          : 0;
        const avgQuery = queries.length > 0 
          ? queries.reduce((sum, r) => sum + r.duration, 0) / queries.length 
          : 0;

        this.results.firestore = {
          docReadTests: docReads.length,
          queryTests: queries.length,
          averageDocRead: avgDocRead,
          averageQuery: avgQuery,
          target: 500, // 500ms target
          docReadMeetsTarget: avgDocRead < 500,
          queryMeetsTarget: avgQuery < 500,
          results: results
        };

        console.log(`   📄 Average doc read: ${avgDocRead.toFixed(0)}ms (target: <500ms)`);
        console.log(`   🔍 Average query: ${avgQuery.toFixed(0)}ms (target: <500ms)`);
        console.log(`   ✅ Success rate: ${docReads.length + queries.length}/${results.length}`);

        if (avgDocRead >= 500) {
          this.results.criticalIssues.push({
            type: 'FIRESTORE_DOC_SLOW',
            message: `Firestore doc reads averaging ${avgDocRead.toFixed(0)}ms (target: <500ms)`,
            impact: 'MEDIUM'
          });
        }

        if (avgQuery >= 1000) {
          this.results.criticalIssues.push({
            type: 'FIRESTORE_QUERY_SLOW',
            message: `Firestore queries averaging ${avgQuery.toFixed(0)}ms (critical: >1000ms)`,
            impact: 'HIGH'
          });
        }
      }

    } catch (error) {
      console.error('❌ Firestore benchmark failed:', error.message);
      this.results.criticalIssues.push({
        type: 'FIRESTORE_BENCHMARK_ERROR',
        message: error.message,
        impact: 'MEDIUM'
      });
    }
  }

  async testFunctionsPerformance() {
    console.log('\n⚡ Testing Firebase Functions Performance...');

    try {
      // Test Functions via HTTP requests (if any exist)
      const functionTests = [
        { url: 'http://localhost:3000/api/health/ping', name: 'Health Check' },
        { url: 'http://localhost:3000/api/auth/session', name: 'Session Check', method: 'GET' }
      ];

      const results = [];

      for (const test of functionTests) {
        for (let i = 0; i < 3; i++) {
          const startTime = Date.now();
          
          try {
            const response = await fetch(test.url, {
              method: test.method || 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            const duration = Date.now() - startTime;
            results.push({
              function: test.name,
              attempt: i + 1,
              duration,
              success: response.ok,
              status: response.status
            });
            
          } catch (error) {
            results.push({
              function: test.name,
              attempt: i + 1,
              duration: Date.now() - startTime,
              success: false,
              error: error.message
            });
          }
        }
      }

      if (results.length > 0) {
        const successfulTests = results.filter(r => r.success);
        const avgDuration = successfulTests.length > 0 
          ? successfulTests.reduce((sum, r) => sum + r.duration, 0) / successfulTests.length 
          : 0;

        this.results.functions = {
          totalTests: results.length,
          successfulTests: successfulTests.length,
          averageDuration: avgDuration,
          target: 2000, // 2 second target
          meetsTarget: avgDuration < 2000,
          results: results
        };

        console.log(`   ⚡ Average function time: ${avgDuration.toFixed(0)}ms (target: <2000ms)`);
        console.log(`   ✅ Success rate: ${successfulTests.length}/${results.length}`);

        if (avgDuration >= 2000) {
          this.results.criticalIssues.push({
            type: 'FUNCTIONS_SLOW',
            message: `Firebase Functions averaging ${avgDuration.toFixed(0)}ms (target: <2000ms)`,
            impact: 'MEDIUM'
          });
        }
      }

    } catch (error) {
      console.error('❌ Functions benchmark failed:', error.message);
      this.results.criticalIssues.push({
        type: 'FUNCTIONS_BENCHMARK_ERROR',
        message: error.message,
        impact: 'LOW'
      });
    }
  }

  async runNodeTest(testCode, testName) {
    const { spawn } = require('child_process');
    
    return new Promise((resolve) => {
      const testFile = path.join(__dirname, \`temp-\${testName}.js\`);
      
      fs.writeFile(testFile, testCode).then(() => {
        const child = spawn('node', [testFile], {
          env: { ...process.env },
          stdio: 'pipe'
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
          output += data.toString();
        });

        child.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        child.on('close', async (code) => {
          await fs.unlink(testFile).catch(() => {});
          
          try {
            // Try to parse JSON output
            const jsonMatch = output.match(/\\[\\s*\\{[\\s\\S]*\\}\\s*\\]/);
            if (jsonMatch) {
              const results = JSON.parse(jsonMatch[0]);
              resolve(results);
            } else {
              resolve([]);
            }
          } catch (error) {
            resolve([]);
          }
        });

        // Timeout after 10 seconds
        setTimeout(() => {
          child.kill();
          resolve([]);
        }, 10000);
      });
    });
  }

  async generateReport() {
    const criticalCount = this.results.criticalIssues.filter(i => i.impact === 'CRITICAL').length;
    const highCount = this.results.criticalIssues.filter(i => i.impact === 'HIGH').length;
    
    const overallPerformance = 
      (this.results.auth.meetsTarget !== false) &&
      (this.results.firestore.docReadMeetsTarget !== false) &&
      (this.results.functions.meetsTarget !== false);

    this.results.summary = {
      overallPerformance,
      criticalIssues: criticalCount,
      highIssues: highCount,
      authPerformance: this.results.auth.meetsTarget,
      firestorePerformance: this.results.firestore.docReadMeetsTarget,
      functionsPerformance: this.results.functions.meetsTarget
    };

    console.log('\n' + '='.repeat(50));
    console.log('🔥 FIREBASE PERFORMANCE BENCHMARK SUMMARY');
    console.log('='.repeat(50));
    console.log(`🔐 Auth Performance: ${this.results.auth.meetsTarget ? 'Meets Target' : 'Below Target'}`);
    console.log(`🗄️ Firestore Performance: ${this.results.firestore.docReadMeetsTarget ? 'Meets Target' : 'Below Target'}`);
    console.log(`⚡ Functions Performance: ${this.results.functions.meetsTarget ? 'Meets Target' : 'Below Target'}`);
    console.log(`⚠️  Critical Issues: ${criticalCount}`);
    console.log(`📈 High Priority Issues: ${highCount}`);
    console.log('');
    console.log(`🚦 Firebase Readiness: ${overallPerformance ? 'READY' : 'NEEDS OPTIMIZATION'}`);

    if (!overallPerformance) {
      console.log('\n❌ FIREBASE PERFORMANCE ISSUES:');
      this.results.criticalIssues.forEach(issue => {
        console.log(`   • ${issue.type}: ${issue.message} (${issue.impact})`);
      });
    }

    // Save detailed report
    await fs.writeFile(
      path.join(__dirname, 'firebase-performance-benchmark-report.json'),
      JSON.stringify(this.results, null, 2)
    );

    console.log('\n📋 Firebase benchmark saved to: firebase-performance-benchmark-report.json');
  }
}

// Run benchmark
async function main() {
  const benchmark = new FirebasePerformanceBenchmark();
  await benchmark.benchmark();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = FirebasePerformanceBenchmark;