import { useState } from 'react';
import { Briefcase, Building2, Camera, CalendarDays, Check, Copy, Mail, MapPin, Palette, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { Avatar, Badge, Button, IconButton, Modal } from '@/components/ui';
import { CoverScene, DEFAULT_COVER } from './coverScenes';

const delay = (ms) => ({ animationDelay: `${ms}ms` });

/**
 * Profile banner: animated cover (user-selectable scene), a large avatar in a slowly turning
 * gradient ring (click to view large), identity line and contact strip.
 */
export function ProfileHero({ user, onChangeAvatar, onChangeCover, coverPaused, joined }) {
  return (
    // joined (phones): section tabs attach to the bottom edge, as on Client details — so no bottom corners / border there
    <section
      className={cn('relative overflow-hidden rounded-2xl border border-glass-border glass shadow-card', joined && 'rounded-b-none border-b-0')}
      aria-labelledby="profile-name"
    >
      {/* coverPaused: frozen while a dialog sits over it (the blurred backdrop re-painted the moving scene every frame) */}
      <div className={coverPaused ? 'ln-anim-paused' : undefined}>
        <Cover user={user} onChangeCover={onChangeCover} />
      </div>

      <div className="relative isolate px-5 pb-6 sm:px-8">
        {/* Soft colour wash behind the details (same feel as the dashboard cards): blue bottom-left, violet top-right */}
        <span
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-chart-1/[0.055] via-transparent via-50% to-chart-4/[0.04]"
          aria-hidden="true"
        />
        {/* Name block starts below the cover with breathing room (the avatar alone overlaps the cover) */}
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <AvatarButton user={user} onClick={onChangeAvatar} />

            <div className="min-w-0 animate-rise sm:pt-6" style={delay(120)}>
              <div className="flex flex-wrap items-center gap-2">
                <h1 id="profile-name" className="text-2xl font-bold tracking-[-0.02em] text-text sm:text-[28px]">
                  {user.name}
                </h1>
                <Badge tone="primary" icon={ShieldCheck}>
                  {user.role}
                </Badge>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="size-4 text-text-muted" aria-hidden="true" />
                  {user.designation || 'Add your designation'}
                </span>
                <span className="hidden text-text-muted sm:inline" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="size-4 text-text-muted" aria-hidden="true" />
                  {user.department || 'Add your department'}
                </span>
              </p>
            </div>
          </div>

          <div className="animate-rise md:pt-6" style={delay(200)}>
            <Button variant="secondary" leftIcon={Sparkles} onClick={onChangeAvatar}>
              Change avatar
            </Button>
          </div>
        </div>

        {/* Contact strip: one segmented panel, each cell a coloured icon tile + label + value (1px gaps draw the dividers).
            Phones: no panel of its own (it sat as a box inside the card) — plain rows under dashed lines */}
        <ul
          className="mt-6 grid animate-rise gap-px overflow-hidden rounded-2xl border border-border-strong bg-border-strong max-sm:mt-5 max-sm:gap-0 max-sm:divide-y max-sm:divide-dashed max-sm:divide-border-strong max-sm:rounded-none max-sm:border-0 max-sm:border-t max-sm:border-dashed max-sm:bg-transparent sm:grid-cols-2 xl:grid-cols-4"
          style={delay(260)}
          aria-label="Contact details"
        >
          <InfoTile icon={Mail} tone="blue" label="Email" value={user.email} href={`mailto:${user.email}`} copyable />
          <InfoTile icon={Phone} tone="green" label="Mobile" value={user.phone} href={user.phone && `tel:${user.phone.replace(/\s/g, '')}`} copyable />
          <InfoTile icon={MapPin} tone="orange" label="Location" value={user.location} />
          <InfoTile icon={CalendarDays} tone="violet" label="Member since" value={user.joinedAt && formatDate(user.joinedAt, { day: undefined })} />
        </ul>
      </div>
    </section>
  );
}

/**
 * Animated cover (scene chosen by the user, see coverScenes.jsx). A "My profile" label sits top-left
 * and the "Change cover" button bottom-right.
 */
function Cover({ user, onChangeCover }) {
  return (
    <div className="relative h-40 overflow-hidden bg-brand-navy sm:h-48">
      {/* key: replay the fade when the scene changes */}
      <div key={user.cover ?? DEFAULT_COVER} className="absolute inset-0 animate-fade-in" aria-hidden="true">
        <CoverScene id={user.cover ?? DEFAULT_COVER} />
      </div>

      {/* Page label */}
      <p
        className="absolute left-5 top-5 animate-rise text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 [text-shadow:0_1px_14px_rgb(0_0_0/0.4)] sm:left-8 sm:top-7"
        style={delay(80)}
      >
        My profile
      </p>

      <button
        type="button"
        onClick={onChangeCover}
        aria-haspopup="dialog"
        aria-label="Change cover"
        className="absolute bottom-3 right-3 inline-flex h-8 items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:bottom-4 sm:right-4"
      >
        <Palette className="size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Change cover</span>
      </button>
    </div>
  );
}

/**
 * Avatar in its turning gradient ring. Clicking the photo opens it large (or the picker, when there's no photo
 * yet). Changing it: the "Change avatar" button, or "Change photo" in the large view.
 */
function AvatarButton({ user, onClick }) {
  const [viewing, setViewing] = useState(false);
  const hasPhoto = Boolean(user.avatar);
  return (
    <div className="relative -mt-14 w-fit shrink-0 animate-rise sm:-mt-16">
      <button
        type="button"
        onClick={hasPhoto ? () => setViewing(true) : onClick}
        aria-label={hasPhoto ? 'View profile picture' : 'Add profile picture'}
        aria-haspopup="dialog"
        className="group relative flex cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {/* Slowly turning gradient ring behind the avatar */}
        <span
          className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,var(--ln-primary),var(--ln-chart-2),var(--ln-chart-4),var(--ln-chart-3),var(--ln-primary))] motion-safe:animate-spin motion-safe:[animation-duration:9s]"
          aria-hidden="true"
        />
        {/* The picture fills the ring edge to edge (no white band between them) */}
        {/* Hover, like a gallery lens: the photo eases in a little and a soft vignette darkens the edges (centre stays clear) */}
        <Avatar
          name={user.name}
          src={user.avatar}
          size="2xl"
          className="relative overflow-hidden rounded-full [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out group-hover:[&_img]:scale-110"
        />
        <span
          className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_45%,rgb(0_0_0/0.45))] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden="true"
        />
      </button>

      {/* Large view of the photo */}
      <Modal
        open={viewing}
        onClose={() => setViewing(false)}
        size="lg"
        title={user.name}
        description="Profile picture"
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewing(false)}>
              Close
            </Button>
            <Button
              leftIcon={Camera}
              onClick={() => {
                setViewing(false);
                onClick();
              }}
            >
              Change photo
            </Button>
          </>
        }
      >
        <div className="flex justify-center rounded-xl bg-surface-sunken/60 p-4">
          <img src={user.avatar} alt={user.name} className="max-h-[65dvh] w-auto max-w-full rounded-xl object-contain shadow-card" />
        </div>
      </Modal>
    </div>
  );
}
// Icon tile tints (static class names so Tailwind can see them)
const TILE_TONES = {
  blue: 'from-chart-1/15 to-chart-1/5 text-chart-1 ring-chart-1/20',
  green: 'from-success-main/20 to-success-main/5 text-success ring-success-main/25',
  orange: 'from-chart-3/25 to-chart-3/5 text-warning ring-chart-3/30',
  violet: 'from-chart-4/15 to-chart-4/5 text-chart-4 ring-chart-4/20',
};

// Faint wash across each cell from its top-left, in the cell's colour
const TILE_WASH = {
  blue: 'from-chart-1/[0.055]',
  green: 'from-success-main/[0.055]',
  orange: 'from-chart-3/[0.06]',
  violet: 'from-chart-4/[0.05]',
};

/** One cell of the contact strip. Email / mobile are links and get a copy button. */
function InfoTile({ icon: Icon, tone, label, value, href, copyable }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <li className="group relative isolate flex min-w-0 items-center gap-3 bg-surface px-4 py-3.5 transition-colors duration-200 hover:bg-surface-secondary max-sm:bg-transparent max-sm:px-0 max-sm:py-3 max-sm:hover:bg-transparent dark:bg-surface-secondary dark:hover:bg-surface-sunken max-sm:dark:bg-transparent">
      <span className={cn('pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br via-transparent to-transparent max-sm:hidden', TILE_WASH[tone])} aria-hidden="true" />
      <span className={cn('inline-flex size-10 shrink-0 max-sm:size-9 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-inset', TILE_TONES[tone])}>
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">{label}</p>
        {value ? (
          href ? (
            <a
              href={href}
              className="block truncate text-sm font-semibold text-text underline-offset-2 hover:text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
            >
              {value}
            </a>
          ) : (
            <p className="truncate text-sm font-semibold text-text">{value}</p>
          )
        ) : (
          <p className="text-sm text-text-muted">Not added</p>
        )}
      </div>
      {copyable && value && (
        <IconButton
          icon={copied ? Check : Copy}
          label={copied ? 'Copied' : `Copy ${label.toLowerCase()}`}
          size="xs"
          onClick={copy}
          className={cn(
            'transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100',
            copied ? 'text-success sm:opacity-100' : 'text-text-muted',
          )}
        />
      )}
    </li>
  );
}
