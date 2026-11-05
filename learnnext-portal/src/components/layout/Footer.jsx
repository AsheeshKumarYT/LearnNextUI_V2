import { APP_NAME } from '@/config/app';

const VERSION = 'v0.1.0';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto sm:border-t sm:border-border">
      {/* Phones: one quiet centred line above the bottom tab bar (two stacked lines with a status dot looked untidy) */}
      <p className="px-4 pb-4 pt-2 text-center text-[11px] text-text-muted/80 sm:hidden">
        © {year} {APP_NAME} · {VERSION}
      </p>
      <div className="mx-auto hidden w-full max-w-[1440px] items-center justify-between gap-2 px-6 py-5 text-xs text-text-muted sm:flex">
        <span>
          © {year} {APP_NAME}. All rights reserved.
        </span>
        <span className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-40" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          All systems operational · {VERSION}
        </span>
      </div>
    </footer>
  );
}
