import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
            <CardDescription>Current balance in your Sardex account</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,234.56 SDX</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              <li>Transaction 1</li>
              <li>Transaction 2</li>
              <li>Transaction 3</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trade Suggestions</CardTitle>
            <CardDescription>AI-powered trade recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Find potential trade partners</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
