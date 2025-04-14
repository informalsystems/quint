import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

export default function MarketplacePage() {
  // Dummy data for marketplace listings
  const listings = [
    {
      id: 1,
      title: 'Web Development Services',
      description: 'Professional web development services for your business.',
      enterprise: 'Acme Web Solutions',
    },
    {
      id: 2,
      title: 'Marketing Consultation',
      description: 'Expert marketing advice to grow your brand.',
      enterprise: 'Global Marketing Inc.',
    },
    {
      id: 3,
      title: 'Accounting Services',
      description: 'Reliable accounting services for small businesses.',
      enterprise: 'Best Accounting Ltd.',
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">Enterprise Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map(listing => (
          <Card key={listing.id}>
            <CardHeader>
              <CardTitle>{listing.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{listing.description}</p>
              <p className="text-sm mt-2">
                Offered by: <strong>{listing.enterprise}</strong>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
