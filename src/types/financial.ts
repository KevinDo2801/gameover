export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  percentage: number;
  amount: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
    cutout: string;
  }[];
}

export interface FinancialData {
  balance: number;
  total: number;
  categories: TransactionCategory[];
  chartData: ChartData;
}

export type TabType = 'expenses' | 'income';

export type TimeFilter = 'day' | 'week' | 'month' | 'year' | 'period';

export interface TimeFilterOption {
  value: TimeFilter;
  label: string;
}

export const TIME_FILTERS: TimeFilterOption[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'period', label: 'Period' },
];

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  {
    id: '1',
    name: 'Credits',
    icon: 'fas fa-credit-card',
    color: '#37C78A',
    percentage: 42,
    amount: 960,
  },
  {
    id: '2',
    name: 'Grocery',
    icon: 'fas fa-shopping-cart',
    color: '#6A4CFF',
    percentage: 38,
    amount: 32,
  },
  {
    id: '3',
    name: 'Restaurants',
    icon: 'fas fa-utensils',
    color: '#2E7DFF',
    percentage: 12,
    amount: 2500,
  },
  {
    id: '4',
    name: 'Home',
    icon: 'fas fa-home',
    color: '#CFEDE3',
    percentage: 6,
    amount: 625,
  },
];

export const INCOME_CATEGORIES: TransactionCategory[] = [
  {
    id: '1',
    name: 'Salary',
    icon: 'fas fa-briefcase',
    color: '#37C78A',
    percentage: 35,
    amount: 5000,
  },
  {
    id: '2',
    name: 'Freelance',
    icon: 'fas fa-laptop',
    color: '#6A4CFF',
    percentage: 25,
    amount: 2000,
  },
  {
    id: '3',
    name: 'Investments',
    icon: 'fas fa-chart-line',
    color: '#2E7DFF',
    percentage: 25,
    amount: 1500,
  },
  {
    id: '4',
    name: 'Other',
    icon: 'fas fa-plus',
    color: '#CFEDE3',
    percentage: 15,
    amount: 800,
  },
];

export const EXPENSE_CHART_DATA: ChartData = {
  labels: ['Credits', 'Grocery', 'Restaurants', 'Home'],
  datasets: [{
    data: [42, 38, 12, 6],
    backgroundColor: ['#37C78A', '#6A4CFF', '#2E7DFF', '#CFEDE3'],
    borderWidth: 0,
    cutout: '70%',
  }],
};

export const INCOME_CHART_DATA: ChartData = {
  labels: ['Salary', 'Freelance', 'Investments', 'Other'],
  datasets: [{
    data: [35, 25, 25, 15],
    backgroundColor: ['#37C78A', '#6A4CFF', '#2E7DFF', '#CFEDE3'],
    borderWidth: 0,
    cutout: '70%',
  }],
};
