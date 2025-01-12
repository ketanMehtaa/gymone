import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md w-full space-y-8 p-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">404 - Page Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div>
          <Link href="/" className="w-full">
            <Button className="w-full">
              Go back home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
} 