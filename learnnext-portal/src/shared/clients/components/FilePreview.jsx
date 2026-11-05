import { Download, ExternalLink, FileImage, FileQuestion, FileText, PlayCircle } from 'lucide-react';
import { formatFileSize } from '@/utils/formatNumber';
import { Button, Modal } from '@/components/ui';
import { EmptyState } from '@/components/feedback';

/**
 * The embeddable player address for a YouTube or Vimeo link (watch / youtu.be / shorts / embed; vimeo.com/123), or null.
 * YouTube uses its privacy-enhanced (no-cookie) player.
 */
export function embedUrl(url = '') {
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, '');
  if (host === 'youtu.be') return u.pathname.slice(1) ? `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}` : null;
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const id = u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = u.pathname.match(/(\d{5,})/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}

/** What kind of preview a file gets: image | pdf | video | embed (YouTube / Vimeo link) | other */
export function fileKind(file) {
  const type = file?.type ?? '';
  const url = file?.url ?? '';
  if (embedUrl(url)) return 'embed';
  const ext = (s) => (s.split(/[?#]/)[0].match(/\.(\w+)$/)?.[1] ?? '').toLowerCase();
  const exts = [ext(file?.name ?? ''), ext(url)];
  if (type.startsWith('image/') || url.startsWith('data:image/') || exts.some((e) => ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(e))) return 'image';
  if (type === 'application/pdf' || exts.includes('pdf')) return 'pdf';
  if (type.startsWith('video/') || exts.some((e) => ['mp4', 'webm', 'mov', 'm4v', 'ogv'].includes(e))) return 'video';
  return 'other';
}

const KIND_LABEL = { pdf: 'PDF document', image: 'Image', video: 'Video', embed: 'Video link', other: 'File' };
const KIND_ICON = { pdf: FileText, image: FileImage, video: PlayCircle, embed: PlayCircle, other: FileQuestion };

/**
 * Full-view preview of an uploaded file — images fit the window, PDFs open in the built-in viewer, videos play in a
 * player with the usual controls, YouTube / Vimeo links in their own embedded player (no Download for those). `file` = { name, url, type?, size? } (null = closed). Open in a new tab / Download in
 * the footer.
 */
export function FilePreviewModal({ file, onClose }) {
  const kind = fileKind(file);
  const Icon = KIND_ICON[kind];
  return (
    <Modal
      open={!!file}
      onClose={onClose}
      size="full"
      icon={Icon}
      title={file?.name ?? 'Preview'}
      description={[KIND_LABEL[kind], file?.size ? formatFileSize(file.size) : null].filter(Boolean).join(' · ')}
      bodyClassName="px-3 pb-3 sm:px-4"
      footer={
        file?.url && (
          <>
            <Button as="a" href={file.url} target="_blank" rel="noreferrer" variant="secondary" leftIcon={ExternalLink}>
              Open in new tab
            </Button>
            {kind !== 'embed' && (
              <Button as="a" href={file.url} download={file.name} leftIcon={Download}>
                Download
              </Button>
            )}
          </>
        )
      }
    >
      {file &&
        (!file.url ? (
          <EmptyState icon={FileQuestion} title="Preview isn’t available" description="This file was attached before previews were supported. Replace it to view it here." />
        ) : kind === 'image' ? (
          // Checkerboard-free soft canvas so transparent logos stay visible
          <div className="flex h-[70dvh] items-center justify-center rounded-xl border border-border bg-surface-sunken/60 p-6">
            <img src={file.url} alt={file.name} className="max-h-full max-w-full object-contain drop-shadow-sm" />
          </div>
        ) : kind === 'pdf' ? (
          <iframe src={file.url} title={file.name} className="h-[72dvh] w-full rounded-xl border border-border bg-white" />
        ) : kind === 'embed' ? (
          // A YouTube / Vimeo link plays in that site's own player
          <div className="flex h-[72dvh] items-center justify-center overflow-hidden rounded-xl bg-black">
            <iframe
              key={file.url}
              src={embedUrl(file.url)}
              title={file.name}
              className="aspect-video max-h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : kind === 'video' ? (
          // A dark stage so the picture reads like a player; the video keeps its shape and fits the window
          <div className="flex h-[72dvh] items-center justify-center overflow-hidden rounded-xl bg-black">
            <video key={file.url} src={file.url} controls playsInline preload="metadata" className="max-h-full max-w-full">
              Your browser can’t play this video — download it instead.
            </video>
          </div>
        ) : (
          <EmptyState icon={FileQuestion} title="No preview for this file type" description="Download it to open it on your device." />
        ))}
    </Modal>
  );
}
