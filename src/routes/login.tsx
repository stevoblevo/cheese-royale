import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-night text-ink">
      <img
        src="/art/castle.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-night/70" />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(24px,env(safe-area-inset-top))]">
        <p className="font-display text-[11px] tracking-[0.28em] text-gold uppercase">
          Cheese Royale
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-[-0.03em]">Sit if you wish</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Sign-in is optional. The table is already set. Authority here is offered, never taken.
        </p>
        <div className="mt-6 space-y-3">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="h-12 w-full rounded-[16px] border border-border bg-night-2/80 text-sm font-bold hover:border-gold/40"
              >
                Continue with {p.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
        <Link
          to="/"
          className="mt-6 text-center text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          Return to the castle
        </Link>
      </div>
    </main>
  );
}
