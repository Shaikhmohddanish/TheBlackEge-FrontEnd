'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllUsers, getDashboardSummary } from '@/lib/api/admin';

export default function AdminAPITest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test: string, success: boolean, data: any, error?: any) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testAdminAPIs = async () => {
    setIsLoading(true);
    setTestResults([]);

    // Test 1: Check if token exists
    const token = localStorage.getItem('token');
    addResult('Token Check', !!token, { hasToken: !!token, tokenPreview: token?.substring(0, 20) + '...' });

    if (!token) {
      setIsLoading(false);
      return;
    }

    // Test 2: Users endpoint
    try {
      console.log('Testing getAllUsers...');
      const usersData = await getAllUsers(0, 10);
      console.log('Users test result:', usersData);
      addResult('Get All Users', true, usersData);
    } catch (error) {
      console.error('Users test failed:', error);
      addResult('Get All Users', false, null, error);
    }

    // Test 3: Dashboard summary endpoint
    try {
      console.log('Testing getDashboardSummary...');
      const summaryData = await getDashboardSummary();
      console.log('Summary test result:', summaryData);
      addResult('Get Dashboard Summary', true, summaryData);
    } catch (error) {
      console.error('Summary test failed:', error);
      addResult('Get Dashboard Summary', false, null, error);
    }

    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin API Test</CardTitle>
          <CardDescription>Test admin dashboard API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={testAdminAPIs} 
              disabled={isLoading}
              variant="default"
            >
              {isLoading ? 'Testing...' : 'Test Admin APIs'}
            </Button>
            <Button 
              onClick={clearResults} 
              variant="outline"
            >
              Clear Results
            </Button>
          </div>

          <div className="space-y-4">
            {testResults.map((result, index) => (
              <Card key={index} className={result.success ? "border-green-200" : "border-red-200"}>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-sm ${result.success ? "text-green-700" : "text-red-700"}`}>
                    {result.test} {result.success ? "✅" : "❌"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {result.timestamp}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result.success ? (
                    <div>
                      <p className="font-medium text-green-600">Success!</p>
                      <pre className="bg-gray-100 p-2 rounded text-xs mt-2 overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-red-600">Error:</p>
                      <pre className="bg-red-50 p-2 rounded text-xs mt-2 overflow-auto">
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}