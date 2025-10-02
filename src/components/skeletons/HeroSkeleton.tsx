// components/skeletons/HeroSkeleton.tsx
"use client";
import React from 'react';
import { SectionWrapper } from '../ui/SectionWrapper';

export const HeroSkeleton: React.FC = () => {
  return (
    <SectionWrapper id="home" className="relative bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30">
      <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
        <div className="text-center space-y-12 max-w-5xl w-full">
          {/* Profile Avatar Skeleton */}
          <div className="relative">
            <div className="w-40 h-40 mx-auto mb-6 relative group">
              {/* Glow effect skeleton */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full blur-lg opacity-30 animate-pulse"></div>
              
              {/* Main avatar skeleton */}
              <div className="w-full h-full rounded-full overflow-hidden relative z-10 shadow-2xl bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]">
              </div>
              
              {/* Status indicator skeleton */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-gray-300 border-4 border-white rounded-full z-20 animate-pulse"></div>
            </div>
          </div>

          {/* Content Section Skeleton */}
          <div className="space-y-8">
            <div className="space-y-4">
              {/* Name Skeleton */}
              <div className="flex justify-center">
                <div className="h-16 md:h-20 w-3/4 md:w-2/3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl animate-shimmer bg-[length:200%_100%]"></div>
              </div>
              
              {/* Tags Skeleton */}
              <div className="flex flex-wrap justify-center gap-3">
                <div className="h-9 w-40 bg-blue-100/50 rounded-full animate-pulse"></div>
                <div className="h-9 w-44 bg-purple-100/50 rounded-full animate-pulse delay-75"></div>
                <div className="h-9 w-36 bg-green-100/50 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%] w-full"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%] w-5/6 mx-auto"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%] w-4/5 mx-auto"></div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="h-14 w-52 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 rounded-2xl animate-shimmer bg-[length:200%_100%] shadow-lg"></div>
              <div className="h-14 w-40 bg-white border-2 border-gray-200 rounded-2xl animate-pulse shadow-md"></div>
              <div className="h-14 w-40 bg-white border-2 border-gray-200 rounded-2xl animate-pulse delay-75 shadow-md"></div>
              <div className="h-14 w-40 bg-white border-2 border-gray-200 rounded-2xl animate-pulse delay-150 shadow-md"></div>
            </div>
          </div>

          {/* Scroll Indicator Skeleton */}
          <div className="pt-16 pb-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="h-4 w-48 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-1 flex flex-col items-center">
                <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse -mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </SectionWrapper>
  );
};