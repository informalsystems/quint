import {suggestTradePartners} from '@/ai/flows/trade-suggestion';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useState} from "react";

export default function TradeSuggestionsPage() {
  const [tradeSuggestions, setTradeSuggestions] = useState<string[]>([]);

  const handleGetSuggestions = async () => {
    const suggestions = await suggestTradePartners({
      userNeeds: 'Need web development services',
      networkActivity: 'Recent purchases include marketing consultation',
    });
    setTradeSuggestions(suggestions.tradeSuggestions);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>AI Trade Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Discover potential trade partners and opportunities based on your needs and network activity.
          </p>
          <Button onClick={handleGetSuggestions}>Get Trade Suggestions</Button>
          {tradeSuggestions.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Suggested Partners</h2>
              <ul>
                {tradeSuggestions.map((suggestion, index) => (
                  <li key={index} className="mb-1">
                    - {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
