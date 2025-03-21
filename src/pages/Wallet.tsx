
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BarChart from '@/components/BarChart';
import { ArrowDown, ArrowUp, Wallet as WalletIcon, CreditCard, DollarSign, RefreshCw } from 'lucide-react';

// Dummy financial data - in a real app this would come from the database
const dummyTransactions = [
  {
    id: '1',
    date: '2023-11-15',
    description: 'Sales Revenue',
    amount: 1256.78,
    type: 'income',
    status: 'completed',
  },
  {
    id: '2',
    date: '2023-11-14',
    description: 'Supplier Payment - Fresh Produce',
    amount: -423.50,
    type: 'expense',
    status: 'completed',
  },
  {
    id: '3',
    date: '2023-11-12',
    description: 'Sales Revenue',
    amount: 987.25,
    type: 'income',
    status: 'completed',
  },
  {
    id: '4',
    date: '2023-11-10',
    description: 'Utility Bill - Electricity',
    amount: -189.34,
    type: 'expense',
    status: 'completed',
  },
  {
    id: '5',
    date: '2023-11-08',
    description: 'Sales Revenue',
    amount: 1102.45,
    type: 'income',
    status: 'completed',
  },
  {
    id: '6',
    date: '2023-11-05',
    description: 'Staff Wages',
    amount: -2450.00,
    type: 'expense',
    status: 'completed',
  },
  {
    id: '7',
    date: '2023-11-03',
    description: 'Sales Revenue',
    amount: 896.12,
    type: 'income',
    status: 'completed',
  },
  {
    id: '8',
    date: '2023-11-01',
    description: 'Equipment Maintenance',
    amount: -157.89,
    type: 'expense',
    status: 'completed',
  },
];

// Dummy chart data
const revenueData = [
  { name: 'Jan', value: 4500 },
  { name: 'Feb', value: 5200 },
  { name: 'Mar', value: 4800 },
  { name: 'Apr', value: 5800 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 6500 },
  { name: 'Jul', value: 7200 },
  { name: 'Aug', value: 6800 },
  { name: 'Sep', value: 7500 },
  { name: 'Oct', value: 8200 },
  { name: 'Nov', value: 3500 }, // Current month (partial)
  { name: 'Dec', value: 0 },
];

const expensesData = [
  { name: 'Jan', value: 3200 },
  { name: 'Feb', value: 3500 },
  { name: 'Mar', value: 3300 },
  { name: 'Apr', value: 3600 },
  { name: 'May', value: 3800 },
  { name: 'Jun', value: 4200 },
  { name: 'Jul', value: 4500 },
  { name: 'Aug', value: 4200 },
  { name: 'Sep', value: 4600 },
  { name: 'Oct', value: 4800 },
  { name: 'Nov', value: 2200 }, // Current month (partial)
  { name: 'Dec', value: 0 },
];

const Wallet = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const totalIncome = dummyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = dummyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const balance = totalIncome - totalExpenses;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <p className="text-gray-500">Track your restaurant's income, expenses, and financial performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Current Balance</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {formatCurrency(balance)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="mr-2 p-1.5 rounded-full bg-green-100">
                  <ArrowUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Income</p>
                  <p className="font-medium">{formatCurrency(totalIncome)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-2 p-1.5 rounded-full bg-red-100">
                  <ArrowDown className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expenses</p>
                  <p className="font-medium">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Balance
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <WalletIcon className="h-5 w-5 mr-2 text-blue-500" />
              <CardTitle>Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full flex justify-between items-center">
              <span>Record Income</span>
              <DollarSign className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full flex justify-between items-center">
              <span>Record Expense</span>
              <CreditCard className="h-4 w-4" />
            </Button>
            <Button variant="secondary" className="w-full">
              Generate Financial Report
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Overview</CardTitle>
            <CardDescription>Monthly Financial Summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Revenue (This Month)</p>
              <p className="text-2xl font-bold">{formatCurrency(3500)}</p>
              <div className="flex items-center mt-1">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8.2%
                </Badge>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Expenses (This Month)</p>
              <p className="text-2xl font-bold">{formatCurrency(2200)}</p>
              <div className="flex items-center mt-1">
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  5.4%
                </Badge>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Profit Margin</p>
              <p className="text-2xl font-bold">37.1%</p>
              <div className="flex items-center mt-1">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  2.3%
                </Badge>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Financial Performance</CardTitle>
            <CardDescription>Yearly overview of revenue and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="profit">Profit</TabsTrigger>
              </TabsList>
              <TabsContent value="revenue" className="h-80">
                <BarChart 
                  data={revenueData} 
                  valueKey="value" 
                  categoryKey="name"
                  color="#4ade80"
                />
              </TabsContent>
              <TabsContent value="expenses" className="h-80">
                <BarChart 
                  data={expensesData} 
                  valueKey="value" 
                  categoryKey="name"
                  color="#f87171"
                />
              </TabsContent>
              <TabsContent value="profit" className="h-80">
                <BarChart 
                  data={revenueData.map((item, i) => ({
                    name: item.name,
                    value: item.value - expensesData[i].value,
                  }))} 
                  valueKey="value" 
                  categoryKey="name"
                  color="#60a5fa"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <p className="font-medium">Staff Wages</p>
                  <Badge variant="outline">Due in 3 days</Badge>
                </div>
                <p className="text-gray-500 text-sm mt-1">Monthly staff salaries</p>
                <p className="font-bold mt-2">{formatCurrency(2450)}</p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <p className="font-medium">Rent Payment</p>
                  <Badge variant="outline">Due in 5 days</Badge>
                </div>
                <p className="text-gray-500 text-sm mt-1">Monthly restaurant space rent</p>
                <p className="font-bold mt-2">{formatCurrency(1500)}</p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <p className="font-medium">Utility Bills</p>
                  <Badge variant="outline">Due in 8 days</Badge>
                </div>
                <p className="text-gray-500 text-sm mt-1">Electricity, water, gas</p>
                <p className="font-bold mt-2">{formatCurrency(350)}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Upcoming Payments
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }
                    >
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline">View All Transactions</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Wallet;
