import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useState} from "react";

export default function PaypalTopUpPage() {
  const [amount, setAmount] = useState<number | null>(null);

  const handleTopUp = async () => {
    // TODO: Implement PayPal top-up logic here
    console.log(`Topping up with ${amount}`);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>PayPal Top-Up</CardTitle>
          <CardDescription>Top up your Sardex account balance using PayPal.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (EUR)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              onChange={e => setAmount(Number(e.target.value))}
            />
          </div>
          <Button onClick={handleTopUp}>Top Up with PayPal</Button>
        </CardContent>
      </Card>
    </div>
  );
}
