'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Trash2, 
  RefreshCw, 
  Database, 
  HardDrive, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useCacheStats } from '@/hooks/use-browser-cache';
import { cacheManager } from '@/lib/api/cached-api-client';

interface CacheStats {
  used: number;
  available: number;
  percentage: number;
}

interface StorageStats {
  indexeddb: CacheStats;
  localStorage: CacheStats;
  sessionStorage: CacheStats;
}

export function CacheManagement() {
  const { stats, loading, fetchStats, cleanExpired, clearAll } = useCacheStats();
  const [isCleaning, setIsCleaning] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastCleaned, setLastCleaned] = useState<number | null>(null);
  const [cleanedCount, setCleanedCount] = useState(0);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageIcon = (type: string) => {
    switch (type) {
      case 'indexeddb': return <Database className="h-4 w-4" />;
      case 'localStorage': return <HardDrive className="h-4 w-4" />;
      case 'sessionStorage': return <Clock className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getStorageName = (type: string) => {
    switch (type) {
      case 'indexeddb': return 'IndexedDB';
      case 'localStorage': return 'Local Storage';
      case 'sessionStorage': return 'Session Storage';
      default: return type;
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUsageBadgeVariant = (percentage: number) => {
    if (percentage < 50) return 'default';
    if (percentage < 80) return 'secondary';
    return 'destructive';
  };

  const handleCleanExpired = async () => {
    setIsCleaning(true);
    try {
      const cleaned = await cleanExpired();
      setCleanedCount(cleaned);
      setLastCleaned(Date.now());
      await fetchStats();
    } catch (error) {
      console.error('Error cleaning expired cache:', error);
    } finally {
      setIsCleaning(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all caches? This action cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    try {
      await clearAll();
      setCleanedCount(0);
      setLastCleaned(Date.now());
      await fetchStats();
    } catch (error) {
      console.error('Error clearing all caches:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearByType = async (type: 'indexeddb' | 'localStorage' | 'sessionStorage') => {
    if (!confirm(`Are you sure you want to clear ${getStorageName(type)}?`)) {
      return;
    }

    try {
      await clearAll(type);
      await fetchStats();
    } catch (error) {
      console.error(`Error clearing ${type}:`, error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading cache statistics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Management
          </CardTitle>
          <CardDescription>
            Monitor and manage browser cache storage across different storage types
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleCleanExpired}
              disabled={isCleaning}
              variant="outline"
              size="sm"
            >
              {isCleaning ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Clean Expired
            </Button>
            <Button
              onClick={handleClearAll}
              disabled={isClearing}
              variant="destructive"
              size="sm"
            >
              {isClearing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Clear All
            </Button>
            <Button
              onClick={fetchStats}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Status Messages */}
          {lastCleaned && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Last cleaned: {new Date(lastCleaned).toLocaleString()}
              {cleanedCount > 0 && ` (${cleanedCount} entries removed)`}
            </div>
          )}

          <Separator />

          {/* Storage Statistics */}
          {stats && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Storage Usage</h3>
              {Object.entries(stats).map(([type, stat]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStorageIcon(type)}
                      <span className="font-medium">{getStorageName(type)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getUsageBadgeVariant(stat.percentage)}>
                        {stat.percentage.toFixed(1)}%
                      </Badge>
                      <Button
                        onClick={() => handleClearByType(type as any)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatBytes(stat.used)} used</span>
                      <span>{formatBytes(stat.available)} available</span>
                    </div>
                    <Progress 
                      value={stat.percentage} 
                      className="h-2"
                    />
                  </div>

                  {/* Warning for high usage */}
                  {stat.percentage > 80 && (
                    <div className="flex items-center gap-2 text-sm text-yellow-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>High storage usage - consider cleaning expired entries</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Cache Information */}
          <Separator />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Cache Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>IndexedDB:</strong> Long-term storage for products, wishlists, and search results
              </div>
              <div>
                <strong>Local Storage:</strong> User preferences and authentication data
              </div>
              <div>
                <strong>Session Storage:</strong> Temporary data like cart contents
              </div>
              <div>
                <strong>Auto-cleanup:</strong> Expired entries are automatically removed
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
