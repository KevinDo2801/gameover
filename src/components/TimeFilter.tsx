import React from 'react';
import type { TimeFilter } from '../types/financial';
import { TIME_FILTERS } from '../types/financial';
import './TimeFilter.css';

interface TimeFilterProps {
  activeFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
  className?: string;
}

const TimeFilterComponent: React.FC<TimeFilterProps> = ({ 
  activeFilter, 
  onFilterChange, 
  className = '' 
}) => {
  const getCurrentDateText = (): string => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
  };

  return (
    <div className={`time-filter-container animate-fade-in ${className}`} style={{ animationDelay: '0.2s' }}>
      <div className="time-filter-buttons">
        {TIME_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`time-filter-button ${
              activeFilter === filter.value ? 'filter-active' : ''
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="current-date">
        {getCurrentDateText()}
      </div>
    </div>
  );
};

export default TimeFilterComponent;
