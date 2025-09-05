'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';

export function StatsSection() {
  const [counters, setCounters] = useState({
    customers: 0,
    products: 0,
    cities: 0,
    satisfaction: 0
  });

  const finalStats = {
    customers: 50000,
    products: 500,
    cities: 100,
    satisfaction: 98
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    const intervals = Object.keys(finalStats).map(key => {
      const finalValue = finalStats[key as keyof typeof finalStats];
      const increment = finalValue / steps;
      let currentValue = 0;
      let step = 0;

      return setInterval(() => {
        step++;
        currentValue = Math.min(currentValue + increment, finalValue);
        
        setCounters(prev => ({
          ...prev,
          [key]: Math.floor(currentValue)
        }));

        if (step >= steps) {
          clearInterval(intervals.find(interval => interval === this));
          setCounters(prev => ({
            ...prev,
            [key]: finalValue
          }));
        }
      }, stepDuration);
    });

    // Cleanup intervals on unmount
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  const stats = [
    {
      icon: <Icons.users className="h-12 w-12" />,
      number: counters.customers.toLocaleString('en-IN'),
      suffix: '+',
      label: 'Happy Customers',
      description: 'Across India'
    },
    {
      icon: <Icons.shoppingBag className="h-12 w-12" />,
      number: counters.products.toLocaleString('en-IN'),
      suffix: '+',
      label: 'Products Sold',
      description: 'This Month'
    },
    {
      icon: <Icons.mapPin className="h-12 w-12" />,
      number: counters.cities.toLocaleString('en-IN'),
      suffix: '+',
      label: 'Cities Served',
      description: 'Pan India Delivery'
    },
    {
      icon: <Icons.star className="h-12 w-12" />,
      number: counters.satisfaction.toLocaleString('en-IN'),
      suffix: '%',
      label: 'Satisfaction Rate',
      description: 'Customer Reviews'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-white/20 text-white">
            Our Impact
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Numbers That <span className="text-primary">Speak</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            From a small startup to India's leading streetwear brand. 
            Here's how far we've come together.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-colors">
                <div className="flex justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="mb-4">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}{stat.suffix}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
                  <p className="text-white/60 text-sm">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Badges */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-6">Recent Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center gap-3">
                <Icons.award className="h-8 w-8 text-yellow-400" />
                <div className="text-left">
                  <div className="font-semibold">Best Streetwear Brand 2024</div>
                  <div className="text-sm text-white/60">Fashion Awards India</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Icons.trophy className="h-8 w-8 text-yellow-400" />
                <div className="text-left">
                  <div className="font-semibold">Top Startup 2024</div>
                  <div className="text-sm text-white/60">Entrepreneur Magazine</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Icons.star className="h-8 w-8 text-yellow-400" />
                <div className="text-left">
                  <div className="font-semibold">5-Star Customer Service</div>
                  <div className="text-sm text-white/60">Trustpilot Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
