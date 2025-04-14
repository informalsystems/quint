"use client";

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useState} from "react";

export default function OnboardingPage() {
  const [userType, setUserType] = useState<'enterprise' | 'consumer' | null>(null);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to Sardex</CardTitle>
          <CardDescription>Choose your account type to get started.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label htmlFor="accountType">Account Type</Label>
            <select
              id="accountType"
              className="w-full border rounded-md px-3 py-2"
              onChange={e => setUserType(e.target.value as 'enterprise' | 'consumer')}
            >
              <option value="">Select Account Type</option>
              <option value="enterprise">Enterprise</option>
              <option value="consumer">Consumer</option>
            </select>
          </div>
          {userType && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name"/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email"/>
              </div>
              <Button>Continue</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
