import { useEffect, useRef, useState } from 'react';
import { Check, ImagePlus, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Avatar, Button, Modal } from '@/components/ui';
import { AVATAR_PRESETS, composeAvatar, presetFor } from './avatarLibrary';

const CROP_SIZE = 320;
const MAX_PHOTO = 5 * 1024 * 1024;
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Centre-crops an image data URL to a square JPEG so stored avatars stay small and round nicely. */
function cropToSquare(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const canvas = document.createElement('canvas');
      canvas.width = CROP_SIZE;
      canvas.height = CROP_SIZE;
      canvas
        .getContext('2d')
        .drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, CROP_SIZE, CROP_SIZE);
      resolve(canvas.toDataURL('image/jpeg', 0.88));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Pick one of the built-in illustrated avatars or upload a photo — all in one grid, no tabs. Nothing is saved until
 * "Save avatar".
 */
export function AvatarPickerModal({ open, onClose, user, onSave }) {
  const [selected, setSelected] = useState(user.avatar ?? null);
  const [upload, setUpload] = useState(null);
  const [saving, setSaving] = useState(false);
  // Each preset as its final picture (backdrop + character), composed when the picker opens: id → data URL
  const [srcs, setSrcs] = useState({});
  useEffect(() => {
    if (!open) return;
    AVATAR_PRESETS.forEach((a) =>
      composeAvatar(a)
        .then((url) => setSrcs((s) => (s[a.id] ? s : { ...s, [a.id]: url })))
        .catch(() => {}),
    );
  }, [open]);

  // Start from the current avatar each time the picker opens
  useEffect(() => {
    if (!open) return;
    const current = user.avatar ?? null;
    setSelected(current);
    // A photo = not one of our avatars (the old drawn avatars were SVG data URLs — those count as avatars too)
    const isPhoto = current && !presetFor(current) && !current.startsWith('data:image/svg');
    setUpload(isPhoto ? current : null);
    setPhotoError(null);
  }, [open, user.avatar]);

  const changed = selected !== (user.avatar ?? null);
  const preset = presetFor(selected);

  // A chosen / dropped file → checked, read, centre-cropped to a square, then selected
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const pickFile = (file) => {
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) return setPhotoError('That file isn’t a JPG, PNG or WebP photo.');
    if (file.size > MAX_PHOTO) return setPhotoError('That photo is over 5 MB — pick a smaller one.');
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const square = await cropToSquare(reader.result).catch(() => reader.result);
      setUpload(square);
      setSelected(square);
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave(selected);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Choose your profile picture"
      description="Pick an avatar or upload your own photo."
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" leftIcon={Trash2} onClick={() => setSelected(null)} disabled={!selected} className="text-danger hover:bg-danger-soft hover:text-danger">
            Use initials
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button onClick={save} loading={saving} disabled={!changed} className="flex-1 sm:flex-none">
              Save avatar
            </Button>
          </div>
        </div>
      }
    >
      {/* Live preview */}
      <div className="relative mb-5 flex items-center gap-4 overflow-hidden rounded-2xl bg-brand-navy p-4 sm:p-5">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden="true" />
        <div className="absolute -right-10 -top-16 size-48 rounded-full bg-primary opacity-50 blur-[60px]" aria-hidden="true" />
        <span className="relative flex shrink-0 rounded-full bg-[conic-gradient(from_0deg,var(--ln-primary),var(--ln-chart-2),var(--ln-chart-4),var(--ln-chart-3),var(--ln-primary))] p-[3px]">
          <span key={selected ?? 'initials'} className="flex animate-scale-in rounded-full">
            <Avatar name={user.name} src={selected} size="xl" />
          </span>
        </span>
        <div className="relative min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Preview</p>
          <p className="mt-1 truncate text-lg font-semibold text-white">{user.name}</p>
          <p className="text-[13px] text-white/65">{preset ? 'Avatar' : selected ? 'Your photo' : 'Initials'}</p>
        </div>
      </div>

      {/* One grid, no tabs (picked from previews: "Upload is the first tile"): a dashed "upload" circle leads, then your
          uploaded photo (pickable like the rest), then the illustrated avatars. A photo can also be dropped anywhere on
          the grid. */}
      <div
        onDragOver={(ev) => {
          if (![...ev.dataTransfer.items].some((it) => it.kind === 'file')) return;
          ev.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(ev) => !ev.currentTarget.contains(ev.relatedTarget) && setDragging(false)}
        onDrop={(ev) => {
          ev.preventDefault();
          setDragging(false);
          pickFile(ev.dataTransfer.files?.[0]);
        }}
        className={cn('-m-1.5 rounded-2xl p-1.5 transition-[background-color,box-shadow]', dragging && 'bg-primary-soft/50 outline-2 outline-dashed outline-primary/45')}
      >
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6" role="group" aria-label="Pictures">
            <input ref={fileRef} type="file" accept={PHOTO_TYPES.join(',')} className="sr-only" tabIndex={-1} onChange={(ev) => { pickFile(ev.target.files?.[0]); ev.target.value = ''; }} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label={upload ? 'Upload a different photo' : 'Upload a photo'}
              className="group flex aspect-square animate-rise flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-border-strong text-text-muted transition-colors hover:border-primary/50 hover:bg-primary-soft/40 hover:text-primary-text focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus"
            >
              <ImagePlus className="size-6 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
              <span className="text-[11px] font-semibold">{upload ? 'Change' : 'Upload'}</span>
            </button>
            {upload && (
              <button
                type="button"
                onClick={() => setSelected(upload)}
                aria-pressed={selected === upload}
                aria-label="Your photo"
                className={cn(
                  'relative aspect-square animate-scale-in rounded-full p-[3px] transition-[background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus',
                  selected === upload ? 'bg-[conic-gradient(from_0deg,var(--ln-primary),var(--ln-chart-2),var(--ln-chart-4),var(--ln-primary))] shadow-[0_8px_20px_-8px_var(--ln-primary-shadow)]' : 'bg-transparent hover:bg-primary/35',
                )}
              >
                <img src={upload} alt="" className="block size-full rounded-full object-cover" />
                {selected === upload && (
                  <span className="absolute -right-0.5 -top-0.5 inline-flex size-6 animate-scale-in items-center justify-center rounded-full bg-primary text-primary-fg ring-2 ring-surface">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                )}
              </button>
            )}
            {/* Colourful illustrated people on pastel backdrops (see avatarLibrary) */}
            {AVATAR_PRESETS.map((a, i) => {
              const active = Boolean(srcs[a.id]) && srcs[a.id] === selected;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={async () => setSelected(srcs[a.id] ?? (await composeAvatar(a).catch(() => null)) ?? selected)}
                  aria-pressed={active}
                  aria-label={`Avatar ${i + 1}`}
                  // Same 3px frame in every state (no movement): clear → soft brand tint on hover → gradient when selected
                  className={cn(
                    'group relative aspect-square animate-rise rounded-full p-[3px] transition-[background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus',
                    active
                      ? 'bg-[conic-gradient(from_0deg,var(--ln-primary),var(--ln-chart-2),var(--ln-chart-4),var(--ln-primary))] shadow-[0_8px_20px_-8px_var(--ln-primary-shadow)]'
                      : 'bg-transparent hover:bg-primary/35',
                  )}
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  {/* The stored picture once composed; until then the render itself (same look) */}
                  <img
                    src={srcs[a.id] ?? a.img}
                    alt=""
                    className={cn('block size-full rounded-full object-cover transition-[filter] duration-200', !active && 'group-hover:brightness-105')}
                  />
                  {active && (
                    <span className="absolute -right-0.5 -top-0.5 inline-flex size-6 animate-scale-in items-center justify-center rounded-full bg-primary text-primary-fg ring-2 ring-surface">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
      </div>
      <p className={cn('mt-3 text-xs', photoError ? 'text-danger' : 'text-text-muted')} role={photoError ? 'alert' : undefined}>
        {photoError ?? 'Photos: JPG, PNG or WebP · up to 5 MB · cropped to a square. Drop one on the grid or use Upload.'}
      </p>
    </Modal>
  );
}
