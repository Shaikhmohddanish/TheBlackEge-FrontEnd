import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerProps {
  className?: string;
  children?: React.ReactNode;
}

export const Shimmer: React.FC<ShimmerProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]',
        className
      )}
      style={{
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    >
      {children}
    </div>
  );
};

// Product Card Shimmer
export const ProductCardShimmer: React.FC = () => {
  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Image Shimmer */}
      <Shimmer className="aspect-square w-full" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Shimmer className="h-4 w-3/4 rounded" />
        
        {/* Price */}
        <Shimmer className="h-5 w-1/2 rounded" />
        
        {/* Rating */}
        <div className="flex items-center space-x-1">
          <Shimmer className="h-4 w-16 rounded" />
        </div>
        
        {/* Button */}
        <Shimmer className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
};

// Product Grid Shimmer
export const ProductGridShimmer: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardShimmer key={index} />
      ))}
    </div>
  );
};

// List Item Shimmer
export const ListItemShimmer: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
      <Shimmer className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-3/4 rounded" />
        <Shimmer className="h-3 w-1/2 rounded" />
      </div>
    </div>
  );
};

// Table Row Shimmer
export const TableRowShimmer: React.FC<{ columns?: number }> = ({ columns = 4 }) => {
  return (
    <tr className="border-b border-gray-200">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Shimmer className="h-4 w-full rounded" />
        </td>
      ))}
    </tr>
  );
};

// Add shimmer animation to global CSS
export const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// Add to your global CSS file
export default Shimmer;
