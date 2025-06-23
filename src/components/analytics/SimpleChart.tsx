"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  title: string;
  data: ChartData[];
  type: 'bar' | 'line' | 'pie';
  height?: number;
  className?: string;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
  title,
  data,
  type,
  height = 200,
  className
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

  const renderBarChart = () => (
    <div className="flex items-end justify-between h-full space-x-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              minHeight: '20px'
            }}
          />
          <span className="text-xs text-muted-foreground mt-1 text-center">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <svg width="100%" height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke="rgb(59, 130, 246)"
        strokeWidth="2"
        points={data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (item.value / maxValue) * 100;
          return `${x}%,${y}%`;
        }).join(' ')}
      />
      {data.map((item, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (item.value / maxValue) * 100;
        return (
          <circle
            key={index}
            cx={`${x}%`}
            cy={`${y}%`}
            r="4"
            fill="rgb(59, 130, 246)"
          />
        );
      })}
    </svg>
  );

  const renderPieChart = () => {
    let currentAngle = 0;
    const radius = 60;
    const centerX = 100;
    const centerY = 100;

    return (
      <svg width="200" height="200" className="mx-auto">
        {data.map((item, index) => {
          const percentage = item.value / totalValue;
          const angle = percentage * 360;
          const startAngle = currentAngle;
          currentAngle += angle;

          const startRad = (startAngle - 90) * (Math.PI / 180);
          const endRad = (currentAngle - 90) * (Math.PI / 180);

          const x1 = centerX + radius * Math.cos(startRad);
          const y1 = centerY + radius * Math.sin(startRad);
          const x2 = centerX + radius * Math.cos(endRad);
          const y2 = centerY + radius * Math.sin(endRad);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
          const color = colors[index % colors.length];

          return (
            <path
              key={index}
              d={pathData}
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: type === 'pie' ? 'auto' : `${height}px` }}>
          {renderChart()}
        </div>
        {type === 'pie' && (
          <div className="mt-4 space-y-2">
            {data.map((item, index) => {
              const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
              const color = colors[index % colors.length];
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {((item.value / totalValue) * 100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 