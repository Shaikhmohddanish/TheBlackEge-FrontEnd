'use client';

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AdvancedSearchResults } from '@/components/search/advanced-search-results';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AdvancedSearchResults />
      <Footer />
    </div>
  );
}