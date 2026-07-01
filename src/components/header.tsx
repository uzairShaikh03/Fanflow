import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { hasSupabaseEnv } from "@/lib/env";

export function Header() {
  return (
    <header className="border-b border-border/60 bg-card/50 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-emerald-400">
            FanFlow
          </span>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Toronto
          </span>
        </Link>
        {hasSupabaseEnv() ? <AuthButton /> : null}
      </div>
    </header>
  );
}
