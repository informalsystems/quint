import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to the Sardex Network Hub</CardTitle>
          <CardDescription>
            Revitalizing the platform, streamlining user interactions, and facilitating trade within the Sardex network.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>
            This application aims to modernize the Sardex network experience, providing a seamless and intuitive
            platform for enterprises and consumers to connect and trade.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="secondary">Learn More</Button>
            <Button>Get Started</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
