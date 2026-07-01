import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SetupNotice() {
  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardHeader>
        <CardTitle className="text-lg text-amber-400">
          Checkpoint 1 — Connect Supabase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          FanFlow is running locally, but it needs a Supabase database. Create a
          free project at{" "}
          <a
            href="https://supabase.com"
            className="text-emerald-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            supabase.com
          </a>
          , then add your keys to <code className="text-foreground">.env.local</code>:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs text-foreground">
{`NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`}
        </pre>
        <p>
          Then run the SQL migrations in <code className="text-foreground">supabase/migrations/</code>{" "}
          via the Supabase SQL Editor (in order: 001, 002, 003).
        </p>
      </CardContent>
    </Card>
  );
}
