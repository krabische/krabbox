import { Button } from "./ui/button";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground mb-6">{description}</p>
        <p className="text-sm text-muted-foreground mb-4">
          This page is coming soon! Continue prompting to help build out this section.
        </p>
        <Button variant="outline">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
