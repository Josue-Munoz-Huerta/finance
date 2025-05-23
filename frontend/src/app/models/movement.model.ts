export interface Movement {
  id?: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}