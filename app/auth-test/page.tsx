'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllUsers, getDashboardSummary } from '@/lib/api/admin';
import { tokenManager } from '@/lib/api-client';

export default function AuthTestPage() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test: string, success: boolean, data: any, error?: any) => {
    setResults(prev => [...prev, {
      test,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testAuthentication = async () => {
    setIsLoading(true);
    setResults([]);

    // Test 1: Check token
    const token = tokenManager.getToken();
    addResult('Token Check', !!token, { 
      hasToken: !!token, 
      tokenLength: token?.length,
      tokenPreview: token?.substring(0, 50) + '...' 
    });

    if (!token) {
      setIsLoading(false);
      return;
    }

    // Test 2: Decode token
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        addResult('Token Decode', true, {
          username: payload.sub,
          roles: payload.roles,
          exp: new Date(payload.exp * 1000),
          isExpired,
          hasAdminRole: (payload.roles || '').includes('ADMIN')
        });

        if (isExpired) {
          addResult('Token Expired', false, null, 'Token has expired');
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      addResult('Token Decode', false, null, error);
    }

    // Test 3: Direct API test
    try {
      const response = await fetch('http://localhost:8080/api/admin/dashboard/health', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseText = await response.text();
      addResult('Direct Health API', response.ok, {
        status: response.status,
        statusText: response.statusText,
        data: responseText
      }, response.ok ? null : `${response.status} ${response.statusText}`);
    } catch (error) {
      addResult('Direct Health API', false, null, error);
    }

    // Test 4: getAllUsers
    try {
      const usersData = await getAllUsers(0, 5);
      addResult('Get All Users', true, usersData);
    } catch (error) {
      addResult('Get All Users', false, null, error);
    }

    // Test 5: getDashboardSummary
    try {
      const summaryData = await getDashboardSummary();
      addResult('Get Dashboard Summary', true, summaryData);
    } catch (error) {
      addResult('Get Dashboard Summary', false, null, error);
    }

    setIsLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>Test admin authentication and API access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={testAuthentication} 
              disabled={isLoading}
              variant="default"
            >
              {isLoading ? 'Testing...' : 'Run Auth Tests'}
            </Button>
            <Button 
              onClick={clearResults} 
              variant="outline"
            >
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className={`border-2 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-lg ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.test} {result.success ? '✅' : '❌'}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {result.timestamp}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div>
                  <p className="font-semibold text-green-600 mb-2">Success!</p>
                  <pre className="bg-white p-3 rounded border text-sm overflow-auto max-h-60">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-red-600 mb-2">Error:</p>
                  <pre className="bg-white p-3 rounded border text-sm overflow-auto max-h-60">
                    {JSON.stringify(result.error, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}