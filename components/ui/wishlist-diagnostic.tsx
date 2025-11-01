'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { getDefaultWishlist, getUserWishlists } from '@/lib/api/wishlist'

export function WishlistDiagnostic() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addResult = (test: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    setTestResults(prev => [...prev, { test, status, message, data, timestamp: new Date().toLocaleTimeString() }])
  }

  const runDiagnostics = async () => {
    if (!user?.id) {
      addResult('Authentication', 'error', 'User not authenticated or user ID missing')
      return
    }

    setIsRunning(true)
    setTestResults([])

    try {
      // Test 1: Authentication Status
      addResult('Authentication', 'info', `User authenticated: ${isAuthenticated}`, { userId: user.id, roles: user.roles })

      // Test 2: Token Check
      const token = localStorage.getItem('token')
      addResult('Token Check', token ? 'success' : 'error', `Token ${token ? 'found' : 'missing'}`, { tokenLength: token?.length })

      // Test 3: Default Wishlist API
      try {
        addResult('API Test', 'info', 'Testing default wishlist endpoint...')
        const defaultWishlist = await getDefaultWishlist(user.id)
        addResult('Default Wishlist', 'success', 'Successfully fetched default wishlist', {
          wishlistId: defaultWishlist.id,
          itemCount: defaultWishlist.items?.length || 0
        })
      } catch (error) {
        addResult('Default Wishlist', 'error', `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { error })
      }

      // Test 4: User Wishlists API
      try {
        addResult('API Test', 'info', 'Testing user wishlists endpoint...')
        const wishlists = await getUserWishlists(user.id)
        addResult('User Wishlists', 'success', `Found ${wishlists.length} wishlists`, { count: wishlists.length })
      } catch (error) {
        addResult('User Wishlists', 'error', `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { error })
      }

    } catch (error) {
      addResult('General Error', 'error', `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsRunning(false)
    }
  }

  if (authLoading) {
    return <div>Loading authentication...</div>
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Wishlist API Diagnostics</CardTitle>
        <CardDescription>
          Test wishlist functionality and API connectivity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p><strong>User:</strong> {user?.name || 'Not authenticated'}</p>
            <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
            <p><strong>Roles:</strong> {user?.roles?.join(', ') || 'N/A'}</p>
          </div>
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning || !isAuthenticated}
          >
            {isRunning ? 'Running Tests...' : 'Run Diagnostics'}
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start gap-2 p-3 border rounded">
                <Badge variant={
                  result.status === 'success' ? 'default' : 
                  result.status === 'error' ? 'destructive' : 
                  'secondary'
                }>
                  {result.status}
                </Badge>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{result.test}</span>
                    <span className="text-sm text-muted-foreground">{result.timestamp}</span>
                  </div>
                  <p className="text-sm">{result.message}</p>
                  {result.data && (
                    <details className="mt-1">
                      <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                        Show details
                      </summary>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}