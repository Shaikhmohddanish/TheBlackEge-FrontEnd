'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { CollectionCard } from '@/components/ui/collection-card';
import { CollectionFavoriteButton } from '@/components/favorites/collection-favorite-button';
import { useToast } from '@/hooks/use-toast';
import { getCollections, searchCollections, type Collection } from '@/lib/api/collections';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCollections();
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      loadCollections();
    }
  }, [searchQuery]);

  const loadCollections = async () => {
    setIsLoading(true);
    try {
      const response = await getCollections(currentPage, 12);
      setCollections(response.content);
      setTotalPages(response.pageable.totalPages);
    } catch (error) {
      console.error('Failed to load collections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load collections. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await searchCollections(searchQuery.trim(), 0, 12);
      setCollections(response.content);
      setTotalPages(response.pageable.totalPages);
      setCurrentPage(0);
    } catch (error) {
      console.error('Failed to search collections:', error);
      toast({
        title: 'Error',
        description: 'Failed to search collections. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Our Collections</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our curated collections of premium streetwear, each telling its own story
              through carefully selected pieces that define urban fashion.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {isSearching && (
                <Icons.spinner className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
              )}
            </div>
          </div>

          {/* Results Info */}
          {searchQuery && (
            <div className="mb-6 text-center">
              <p className="text-muted-foreground">
                {collections.length} collection{collections.length !== 1 ? 's' : ''} found for "{searchQuery}"
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Icons.spinner className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading collections...</p>
              </div>
            </div>
          ) : collections.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <Icons.shoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No collections found' : 'No collections available'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms or browse all collections.'
                  : 'Collections will appear here once they are available.'
                }
              </p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')}>
                  <Icons.x className="mr-2 h-4 w-4" />
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            /* Collections Grid */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {collections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    linkType="id"
                    showFavorite={true}
                    size="md"
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    <Icons.chevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        className="w-8 h-8 p-0"
                      >
                        {i + 1}
                      </Button>
              ))}
            </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    Next
                    <Icons.chevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}