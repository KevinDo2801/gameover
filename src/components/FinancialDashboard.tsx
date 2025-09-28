import React, { useState } from 'react';
import Header from './Header';
import TabNavigation from './TabNavigation';
import TimeFilterComponent from './TimeFilter';
import ExpenseChart from './ExpenseChart';
import TransactionList from './TransactionList';
import type { 
  TabType, 
  TimeFilter
} from '../types/financial';
import { 
  EXPENSE_CATEGORIES, 
  INCOME_CATEGORIES, 
  EXPENSE_CHART_DATA, 
  INCOME_CHART_DATA 
} from '../types/financial';
import './FinancialDashboard.css';

const FinancialDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('expenses');
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('week');

  const currentData = activeTab === 'expenses' ? {
    balance: 24855,
    total: 2845,
    categories: EXPENSE_CATEGORIES,
    chartData: EXPENSE_CHART_DATA,
  } : {
    balance: 24855,
    total: 9300,
    categories: INCOME_CATEGORIES,
    chartData: INCOME_CHART_DATA,
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleFilterChange = (filter: TimeFilter) => {
    setActiveFilter(filter);
  };


  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Header balance={currentData.balance} />
        
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
        
        <TimeFilterComponent 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
        />
        
        <ExpenseChart 
          data={currentData.chartData} 
          total={currentData.total} 
        />
        
        <TransactionList categories={currentData.categories} />
      </div>
    </div>
  );
};

export default FinancialDashboard;
