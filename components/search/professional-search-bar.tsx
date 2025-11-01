'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { debounce } from '@/lib/api-client';
import Image from 'next/image';

interface SearchSuggestion {
  text: string;
  type: 'PRODUCT' | 'CATEGORY' | 'BRAND' | 'TRENDING';
  description?: string;
  imageUrl?: string;
  productId?: number;
  searchCount?: number;
}

interface ProfessionalSearchBarProps {
  className?: string;
  placeholder?: string;
  showTrending?: boolean;
  onSearchSubmit?: (query: string) => void;
  variant?: 'header' | 'hero' | 'inline';
}

export function ProfessionalSearchBar({
  className,
  placeholder = "Search for premium streetwear, brands, collections...",
  showTrending = true,
  onSearchSubmit,
  variant = 'header'
}: ProfessionalSearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Get search suggestions from API
  const fetchSuggestions = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=8`
        );
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Get trending searches
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/search/trending?limit=6`
        );
        if (response.ok) {
          const data = await response.json();
          setTrendingSearches(data);
        }
      } catch (error) {
      }
    };

    if (showTrending) {
      fetchTrending();
    }
  }, [showTrending]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      fetchSuggestions(value);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(showTrending && trendingSearches.length > 0);
    }
  };

  // Handle search submission
  const handleSearch = (searchQuery?: string) => {
    const searchTerm = searchQuery || query.trim();
    if (!searchTerm) return;

    setIsOpen(false);
    setQuery(searchTerm);

    // Track search
    trackSearch(searchTerm);

    // Navigate to search results or call callback
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm);
    } else {
      router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'PRODUCT' && suggestion.productId) {
      router.push(`/products/${suggestion.productId}`);
    } else {
      handleSearch(suggestion.text);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = suggestions.length + (showTrending ? trendingSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : -1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : totalItems - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < suggestions.length) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else {
            const trendingIndex = selectedIndex - suggestions.length;
            handleSearch(trendingSearches[trendingIndex]);
          }
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle focus
  const handleFocus = () => {
    if (query.trim() || (showTrending && trendingSearches.length > 0)) {
      setIsOpen(true);
    }
  };

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track search analytics
  const trackSearch = async (searchQuery: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/search/track`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: searchQuery,
            action: 'search',
            timestamp: new Date().toISOString()
          })
        }
      );
    } catch (error) {
    }
  };

  // Render suggestion item
  const renderSuggestion = (suggestion: SearchSuggestion, index: number) => {
    const isSelected = index === selectedIndex;
    
    return (
      <div
        key={`${suggestion.type}-${suggestion.text}-${index}`}
        className={cn(
          "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200",
          "hover:bg-muted/50 border-b border-border/30 last:border-b-0",
          isSelected && "bg-muted/70"
        )}
        onClick={() => handleSuggestionClick(suggestion)}
      >
        {/* Suggestion Icon/Image */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
          {suggestion.imageUrl ? (
            <Image
              src={suggestion.imageUrl}
              alt={suggestion.text}
              width={32}
              height={32}
              className="object-cover"
            />
          ) : (
            <Icons.search className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        {/* Suggestion Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground truncate">
              {suggestion.text}
            </span>
            <Badge variant="secondary" className="text-xs shrink-0">
              {suggestion.type.toLowerCase()}
            </Badge>
          </div>
          {suggestion.description && (
            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {suggestion.description}
            </p>
          )}
        </div>

        {/* Search Count or Arrow */}
        <div className="flex-shrink-0 text-muted-foreground">
          {suggestion.searchCount ? (
            <span className="text-xs">{suggestion.searchCount}</span>
          ) : (
            <Icons.arrowUpRight className="w-4 h-4" />
          )}
        </div>
      </div>
    );
  };

  // Render trending searches
  const renderTrendingSearches = () => {
    if (!showTrending || !trendingSearches.length || suggestions.length > 0) return null;

    return (
      <div className="p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icons.trendingUp className="w-4 h-4" />
          Trending Searches
        </h4>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((trend, index) => {
            const globalIndex = suggestions.length + index;
            const isSelected = globalIndex === selectedIndex;
            
            return (
              <Badge
                key={trend}
                variant={isSelected ? "default" : "secondary"}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-105",
                  isSelected && "ring-2 ring-primary/50"
                )}
                onClick={() => handleSearch(trend)}
              >
                <Icons.hash className="w-3 h-3 mr-1" />
                {trend}
              </Badge>
            );
          })}
        </div>
      </div>
    );
  };

  // Get container styles based on variant
  const getContainerStyles = () => {
    switch (variant) {
      case 'hero':
        return "w-full max-w-2xl mx-auto";
      case 'inline':
        return "w-full max-w-lg";
      default:
        return "w-full max-w-md";
    }
  };

  const getInputStyles = () => {
    switch (variant) {
      case 'hero':
        return "h-14 text-lg px-6 pr-14";
      case 'inline':
        return "h-12 px-4 pr-12";
      default:
        return "h-10 px-4 pr-10";
    }
  };

  return (
    <div ref={searchRef} className={cn("relative", getContainerStyles(), className)}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className={cn(
            "bg-background/95 backdrop-blur-sm border-border/60",
            "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
            "placeholder:text-muted-foreground/60",
            getInputStyles()
          )}
          autoComplete="off"
          spellCheck="false"
        />
        
        {/* Search Button */}
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2",
            "hover:bg-primary hover:text-primary-foreground",
            variant === 'hero' ? "h-12 w-12" : "h-8 w-8"
          )}
        >
          {isLoading ? (
            <Icons.spinner className="h-4 w-4 animate-spin" />
          ) : (
            <Icons.search className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border-border/60 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-0 max-h-80 overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Icons.spinner className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Finding products...
                </span>
              </div>
            )}

            {/* Suggestions */}
            {!isLoading && suggestions.length > 0 && (
              <div>
                {suggestions.map((suggestion, index) => renderSuggestion(suggestion, index))}
              </div>
            )}

            {/* Trending Searches */}
            {!isLoading && renderTrendingSearches()}

            {/* No Results */}
            {!isLoading && suggestions.length === 0 && query.length >= 2 && (
              <div className="p-6 text-center">
                <Icons.search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No suggestions found for "{query}"
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleSearch()}
                >
                  Search anyway
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
