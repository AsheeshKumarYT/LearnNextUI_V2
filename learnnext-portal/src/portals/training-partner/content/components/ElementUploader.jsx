import { useRef, useState } from 'react';
import { Check, ChevronDown, ChevronRight, FileText, Globe, Link2, PlayCircle, Plus, Upload, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatFileSize } from '@/utils/formatNumber';
import { Button, Input, Popover } from '@/components/ui';
import { embedUrl } from '@/shared/clients/components/FilePreview';
import { FILE_KINDS, KIND_ORDER, smartTitle, videoHost } from './contentStages';

// What each upload accepts, and the size limit per file
const ACCEPT = {
  document: {
    accept: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv',
    max: 25 * 1024 * 1024,
  },
  video: { accept: 'video/*', max: 500 * 1024 * 1024 },
};
const DOC_EXT = new RegExp(`(${ACCEPT.document.accept.replace(/\./g, '\\.').replace(/,/g, '|')})$`, 'i');

/** Frees the in-memory previews of files added in this form but not saved (saved files keep theirs — the store uses them) */
export function revokeNew(files) {
  files.forEach((f) => f._k && f.url?.startsWith('blob:') && URL.revokeObjectURL(f.url));
}

let keySeq = 0;

/**
 * The element's files as a small media library (picked from previews: "Media tiles"). Three neutral buttons add a
 * Document, a Video (menu: upload a file / paste a link) or a Link; files can also be dropped anywhere on it (sorted by
 * type). Each kind gets its own row — a quiet label on the left, its tiles on the right — split by hairlines. A tile is
 * a picture of the item (a page with its type for documents, the first frame / YouTube thumbnail with a play mark for
 * videos, a globe for links) with its name underneath, edited in place and required. File name · size or the address
 * shows on hover only; remove (×) sits on the tile's corner on hover. The first new name is selected after adding.
 * value = [{ kind: document | video | url, title, name, size?, type?, url?, source?: 'link' (a pasted video) }].
 */
export function ElementUploader({ value, onChange, error, tried, onError }) {
  const [editingKey, setEditingKey] = useState(null); // whose name is being typed (the first new one after adding)
  const [linkFor, setLinkFor] = useState(null); // null | 'video' | 'url' — which link field is open
  const [over, setOver] = useState(false);
  const docInput = useRef(null);
  const videoInput = useRef(null);
  const keyOf = (f) => f.id ?? f._k;

  const add = (items) => {
    if (!items.length) return;
    const fresh = items.map((f) => ({
      ...f,
      title: smartTitle(f),
      _k: `new-${++keySeq}`,
    }));
    onChange([...value, ...fresh]);
    setEditingKey(fresh[0]._k);
  };
  const remove = (f) => {
    revokeNew([f]);
    onChange(value.filter((x) => x !== f));
  };
  const rename = (f, title) => onChange(value.map((x) => (x === f ? { ...x, title } : x)));

  // Files picked for one kind, or dropped (any mix — sorted by type); too-big ones are skipped with a note
  const take = (list, only) => {
    const ok = [];
    for (const f of list ?? []) {
      const kind = f.type.startsWith('video/') ? 'video' : 'document';
      // A drop isn't filtered by the picker's accept list, so documents are checked by extension here
      if (kind === 'document' && !DOC_EXT.test(f.name)) {
        onError(`${f.name}: not a supported document (PDF, Word, PowerPoint, Excel, TXT or CSV)`);
        continue;
      }
      if (only && kind !== only) {
        onError(`${f.name}: ${only === 'video' ? 'not a video file' : 'add videos with Video'}`);
        continue;
      }
      if (f.size > ACCEPT[kind].max) {
        onError(`${f.name} is over ${formatFileSize(ACCEPT[kind].max)}`);
        continue;
      }
      ok.push({
        kind,
        name: f.name,
        size: f.size,
        type: f.type,
        url: URL.createObjectURL(f),
      });
    }
    add(ok);
  };

  const rows = KIND_ORDER.map((k) => [k, value.filter((f) => f.kind === k)]).filter(([, items]) => items.length);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        take(e.dataTransfer.files);
      }}
      className="relative"
    >
      {/* Phones: the label on its own line, the three buttons below in an even row; from sm: one line, buttons right */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <p className="text-[13px] font-medium text-text sm:mr-auto">
          Element uploader
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        </p>
        <div className="grid grid-cols-3 gap-2 sm:flex">
          <Button variant="secondary" size="sm" leftIcon={FileText} onClick={() => docInput.current?.click()} className="w-full sm:w-auto">
            Document
          </Button>
          <VideoMenu
            triggerClassName="w-full sm:w-auto"
            trigger={
              <Button variant="secondary" size="sm" leftIcon={PlayCircle} rightIcon={ChevronDown} className="w-full sm:w-auto">
                Video
              </Button>
            }
            onUpload={() => videoInput.current?.click()}
            onPaste={() => setLinkFor('video')}
          />
          <Button variant="secondary" size="sm" leftIcon={Globe} onClick={() => setLinkFor('url')} className="w-full sm:w-auto">
            Link
          </Button>
        </div>

        <input
          ref={docInput}
          type="file"
          multiple
          accept={ACCEPT.document.accept}
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            take(e.target.files, 'document');
            e.target.value = '';
          }}
        />
        <input
          ref={videoInput}
          type="file"
          multiple
          accept={ACCEPT.video.accept}
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            take(e.target.files, 'video');
            e.target.value = '';
          }}
        />
      </div>

      {linkFor && (
        <LinkField
          key={linkFor}
          video={linkFor === 'video'}
          onAdd={(url) => {
            add([linkFor === 'video' ? { kind: 'video', source: 'link', name: url, url } : { kind: 'url', name: url, url }]);
            setLinkFor(null);
          }}
          onCancel={() => setLinkFor(null)}
        />
      )}

      {/* The library: nothing in yet → one quiet empty box; otherwise one panel per kind (Documents, Videos, Links),
          each with its own tinted header strip — icon, name, count — over its tiles, with space between panels */}
      {rows.length === 0 ? (
        <EmptyDrop over={over} invalid={Boolean(error)} onDocument={() => docInput.current?.click()} onVideo={() => videoInput.current?.click()} onLink={() => setLinkFor('url')} />
      ) : (
        <div className={cn('mt-3 space-y-3 rounded-xl transition-colors', over && 'bg-primary-soft/40 outline-2 outline-dashed outline-offset-4 outline-primary/40')}>
          {rows.map(([k, items]) => {
            const K = FILE_KINDS[k];
            return (
              <section key={k} aria-label={K.plural} className="overflow-hidden rounded-xl border border-border-strong/70 bg-surface shadow-xs dark:bg-surface-secondary">
                <header className={cn('flex items-center gap-2 border-b border-border/60 px-3.5 py-2', K.head)}>
                  <K.icon className={cn('size-4', K.text)} aria-hidden="true" />
                  <h4 className="text-[13px] font-semibold text-text">{K.plural}</h4>
                  <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-surface/80 px-1 text-[10px] font-semibold tabular-nums text-text-secondary shadow-xs dark:bg-surface-secondary/80">
                    {items.length}
                  </span>
                </header>
                <ul className="flex flex-wrap gap-x-3 gap-y-4 px-3.5 py-3.5">
                  {items.map((f) => (
                    <Tile
                      key={keyOf(f)}
                      item={f}
                      tried={tried}
                      editing={editingKey === keyOf(f)}
                      onEdit={(on) => setEditingKey(on ? keyOf(f) : null)}
                      onRename={rename}
                      onRemove={remove}
                    />
                  ))}
                  {/* "+" tile: add more of this kind right here */}
                  <li className="w-[6.5rem]">
                    {k === 'video' ? (
                      <VideoMenu
                        placement="bottom-start"
                        triggerClassName="w-full"
                        trigger={<AddMoreTile label="Add video" />}
                        onUpload={() => videoInput.current?.click()}
                        onPaste={() => setLinkFor('video')}
                      />
                    ) : (
                      <AddMoreTile label={k === 'document' ? 'Add document' : 'Add link'} onClick={() => (k === 'document' ? docInput.current?.click() : setLinkFor('url'))} />
                    )}
                  </li>
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * The empty uploader: a soft dashed drop area with a little fanned stack of three tiles — a document, a video and a link,
 * each in its kind's colour (they spread a touch on hover / while dragging, and each is a shortcut to add that kind) —
 * over "Drop files here" and one quiet line.
 */
function EmptyDrop({ over, invalid, onDocument, onVideo, onLink }) {
  const tiles = [
    { kind: 'document', run: onDocument, label: 'Add a document', pose: '-rotate-[9deg] translate-x-3 translate-y-1', spread: 'group-hover/drop:-translate-x-1 group-hover/drop:-rotate-[13deg]', dragging: '-translate-x-1 -rotate-[13deg]' },
    { kind: 'video', run: onVideo, label: 'Upload a video', pose: 'z-10 -translate-y-1', spread: 'group-hover/drop:-translate-y-2.5', dragging: '-translate-y-2.5' },
    { kind: 'url', run: onLink, label: 'Add a link', pose: 'rotate-[9deg] -translate-x-3 translate-y-1', spread: 'group-hover/drop:translate-x-1 group-hover/drop:rotate-[13deg]', dragging: 'translate-x-1 rotate-[13deg]' },
  ];
  return (
    <div
      className={cn(
        'group/drop mt-3 flex flex-col items-center rounded-xl border-[1.5px] border-dashed px-6 pb-6 pt-7 text-center transition-colors',
        invalid ? 'border-danger/50 bg-danger-soft/20' : over ? 'border-primary/60 bg-primary-soft/50' : 'border-text-muted/45 bg-surface shadow-xs hover:border-primary/45 dark:bg-surface-secondary',
      )}
    >
      <div className="flex items-center" aria-hidden={over || undefined}>
        {tiles.map((t) => {
          const K = FILE_KINDS[t.kind];
          return (
            <button
              key={t.kind}
              type="button"
              onClick={t.run}
              aria-label={t.label}
              title={t.label}
              className={cn(
                'relative inline-flex size-12 items-center justify-center rounded-2xl shadow-sm ring-[3px] ring-surface transition-transform duration-300 ease-out focus-visible:outline-none focus-visible:ring-focus dark:ring-surface-secondary',
                K.tile,
                t.pose,
                t.spread,
                over && t.dragging,
              )}
            >
              <K.icon className="size-5" />
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm font-semibold text-text">{over ? 'Release to add' : 'Drop files here'}</p>
      <p className="mt-0.5 text-xs text-text-muted">or add a document, video or link</p>
    </div>
  );
}

/**
 * The "add a video" menu (the Video button and the videos' + tile): two roomy options — each a soft coloured icon tile,
 * a bold title and one line — with a quiet heading. Hover / focus shows a soft wash and a sliding chevron.
 */
function VideoMenu({ trigger, onUpload, onPaste, placement = 'bottom-end', triggerClassName }) {
  const options = [
    { key: 'upload', icon: Upload, tile: 'bg-danger-main/10 text-danger', title: 'Upload a video', line: 'MP4, MOV or WebM · max 500 MB', run: onUpload },
    { key: 'link', icon: Link2, tile: 'bg-chart-2/12 text-info', title: 'Paste a video link', line: 'YouTube, Vimeo or a direct link', run: onPaste },
  ];
  return (
    <Popover trigger={trigger} placement={placement} role="menu" triggerClassName={triggerClassName} className="w-[19rem] p-1.5">
      {({ close }) => (
        <>
          <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">Add a video</p>
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              role="menuitem"
              onClick={() => {
                close();
                o.run();
              }}
              className="group/opt flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-sunken/70 focus-visible:bg-surface-sunken/70 focus-visible:outline-none"
            >
              <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-xl', o.tile)} aria-hidden="true">
                <o.icon className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-text">{o.title}</span>
                <span className="block text-xs text-text-muted">{o.line}</span>
              </span>
              <ChevronRight
                className="size-4 shrink-0 -translate-x-1 text-text-muted opacity-0 transition-[opacity,transform] duration-200 group-hover/opt:translate-x-0 group-hover/opt:opacity-100 group-focus-visible/opt:translate-x-0 group-focus-visible/opt:opacity-100"
                aria-hidden="true"
              />
            </button>
          ))}
        </>
      )}
    </Popover>
  );
}

/** A link field under the buttons: the address (checked) with Add / cancel; Enter adds, Esc closes */
function LinkField({ video, onAdd, onCancel }) {
  const [url, setUrl] = useState('');
  const [bad, setBad] = useState('');
  const submit = () => {
    let u;
    try {
      u = new URL(/^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`);
    } catch {
      u = null;
    }
    if (!url.trim() || !u || !u.hostname.includes('.')) return setBad('Enter a full link, e.g. https://example.com/page');
    onAdd(u.href);
    return undefined;
  };
  return (
    <div className="mt-3 animate-fade-in">
      <div className="flex gap-2">
        <Input
          leftIcon={video ? PlayCircle : Globe}
          autoFocus
          placeholder={video ? 'Paste a YouTube, Vimeo or video link' : 'Paste a web link'}
          value={url}
          invalid={Boolean(bad)}
          onChange={(e) => {
            setUrl(e.target.value);
            setBad('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
            if (e.key === 'Escape') {
              e.stopPropagation();
              onCancel();
            }
          }}
          aria-label={video ? 'Video link' : 'Web link'}
          className="min-w-0 flex-1"
        />
        <Button leftIcon={Check} onClick={submit} className="shrink-0">
          Add
        </Button>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-control text-text-muted hover:bg-surface-sunken hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:size-9"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      {bad && <p className="mt-1.5 text-xs text-danger">{bad}</p>}
    </div>
  );
}

/** The YouTube thumbnail for a YouTube link (else null) */
function youtubeThumb(url) {
  const id = embedUrl(url)?.match(/youtube-nocookie\.com\/embed\/([^/?]+)/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : null;
}

/**
 * One item as a tile: its picture, then its name (edits in place, required). The tooltip carries the file name · size
 * or the address; × on the corner removes it (shown on hover / focus, always on touch screens).
 */
function Tile({ item: f, tried, editing, onEdit, onRename, onRemove }) {
  const blank = tried && !f.title?.trim();
  const linked = f.kind === 'url' || f.source === 'link';
  const detail = linked ? f.url : `${f.name} · ${formatFileSize(f.size)}`;
  return (
    <li className="group/tile relative w-[6.5rem] animate-fade-in" title={detail}>
      <TilePicture item={f} />
      <button
        type="button"
        onClick={() => onRemove(f)}
        aria-label={`Remove ${f.title || f.name}`}
        className="absolute -right-1.5 -top-1.5 inline-flex size-6 items-center justify-center rounded-full bg-surface text-text-secondary shadow-sm ring-1 ring-border-strong transition-opacity hover:text-danger focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:opacity-0 sm:group-hover/tile:opacity-100 [@media(hover:none)]:opacity-100 dark:bg-surface-secondary"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
      {/* The name: plain centred text (up to two lines, so long names read in full); click it to type — a field
          opens with the name selected, and Enter / leaving closes it */}
      {editing ? (
        <input
          autoFocus
          onFocus={(e) => e.target.select()}
          value={f.title ?? ''}
          onChange={(e) => onRename(f, e.target.value)}
          onBlur={() => onEdit(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.blur();
            }
          }}
          placeholder="Name it"
          aria-label={`Name for ${f.name}`}
          aria-invalid={blank || undefined}
          className="mt-1.5 w-full rounded-md border border-primary/50 bg-surface px-1 py-0.5 text-center text-xs font-medium text-text ring-2 ring-focus/30 placeholder:font-normal placeholder:text-text-muted focus:outline-none dark:bg-surface-secondary"
        />
      ) : (
        <button
          type="button"
          onClick={() => onEdit(true)}
          title={f.title ? `${f.title} — click to rename` : 'Click to name it'}
          aria-label={`Rename ${f.title || f.name}`}
          aria-invalid={blank || undefined}
          className={cn(
            'mt-1.5 block w-full rounded-md border px-1 py-0.5 text-center text-xs font-medium leading-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
            blank ? 'border-danger/60 bg-danger-soft/30 text-danger' : 'border-transparent text-text hover:border-border-strong',
          )}
        >
          <span className="line-clamp-2 break-words">{f.title?.trim() || 'Name it'}</span>
        </button>
      )}
    </li>
  );
}

// A document's colour by file type: a faint wash on its tile and a solid badge (amber kept lighter — it reads loud)
const DOC_TONE = {
  PDF: { wash: 'bg-danger-main/[0.06]', badge: 'bg-danger-main/85' },
  DOC: { wash: 'bg-chart-1/[0.06]', badge: 'bg-chart-1/85' },
  DOCX: { wash: 'bg-chart-1/[0.06]', badge: 'bg-chart-1/85' },
  XLS: { wash: 'bg-success-main/[0.06]', badge: 'bg-success-main/85' },
  XLSX: { wash: 'bg-success-main/[0.06]', badge: 'bg-success-main/85' },
  CSV: { wash: 'bg-success-main/[0.06]', badge: 'bg-success-main/85' },
  PPT: { wash: 'bg-chart-3/[0.07]', badge: 'bg-chart-3/90' },
  PPTX: { wash: 'bg-chart-3/[0.07]', badge: 'bg-chart-3/90' },
};
const DOC_DEFAULT = { wash: 'bg-text-muted/[0.06]', badge: 'bg-text-muted/80' };

/** The "+" tile closing each row — dashed, same size as a tile, with a caption where a name would be */
function AddMoreTile({ label, ...props }) {
  return (
    <button type="button" {...props} className="group/more block w-full text-center focus-visible:outline-none" aria-label={label}>
      <span className="flex h-[4.5rem] w-full items-center justify-center rounded-xl border border-dashed border-border-strong text-text-muted transition-colors group-hover/more:border-primary/45 group-hover/more:text-primary-text group-focus-visible/more:ring-2 group-focus-visible/more:ring-focus">
        <Plus className="size-5 transition-transform duration-300 ease-out group-hover/more:rotate-90" aria-hidden="true" />
      </span>
      <span className="mt-1.5 block py-0.5 text-xs text-text-muted group-hover/more:text-primary-text">{label}</span>
    </button>
  );
}

/** The tile's picture: a page with the file type, a video frame / thumbnail with a play mark, or a globe for a link */
function TilePicture({ item: f }) {
  // Hover: a soft outline and shadow (no lift)
  const box =
    'relative flex h-[4.5rem] w-full items-center justify-center overflow-hidden rounded-xl border shadow-xs transition-[border-color,box-shadow] duration-200 group-hover/tile:border-primary/35 group-hover/tile:shadow-sm';
  if (f.kind === 'video') {
    const thumb = f.source === 'link' ? youtubeThumb(f.url) : null;
    const host = f.source === 'link' ? videoHost(f.url) : null;
    return (
      <div className={cn(box, 'border-border-strong/60 bg-black/85')}>
        {thumb ? (
          <img src={thumb} alt="" className="absolute inset-0 size-full object-cover opacity-90" loading="lazy" />
        ) : f.source !== 'link' && f.url ? (
          // The video's own first frame (muted, never plays here)
          <video src={`${f.url}#t=0.5`} muted preload="metadata" playsInline className="absolute inset-0 size-full object-cover opacity-90" aria-hidden="true" />
        ) : null}
        <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-black/80 shadow-sm" aria-hidden="true">
          <PlayCircle className="size-5" />
        </span>
        {f.source === 'link' && (
          <span className="absolute bottom-1 left-1 inline-flex items-center gap-0.5 rounded bg-black/55 px-1 py-px text-[9px] font-semibold text-white">
            <Link2 className="size-2.5" aria-hidden="true" />
            {host ?? 'Link'}
          </span>
        )}
      </div>
    );
  }
  if (f.kind === 'url') {
    let host = '';
    try {
      host = new URL(f.url).hostname.replace(/^www\./, '');
    } catch {
      host = '';
    }
    return (
      <div className={cn(box, 'flex-col gap-1.5 border-border-strong/60 bg-chart-2/[0.07]')}>
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-surface text-info shadow-xs dark:bg-surface-secondary" aria-hidden="true">
          <Globe className="size-[18px]" />
        </span>
        <span className="max-w-[90%] truncate text-[9px] font-medium text-text-secondary">{host}</span>
      </div>
    );
  }
  // A document: a page with a folded corner and its type, on a faint wash of the type's colour
  const ext = (f.name.match(/\.(\w+)$/)?.[1] ?? 'file').toUpperCase().slice(0, 4);
  const tone = DOC_TONE[ext] ?? DOC_DEFAULT;
  return (
    <div className={cn(box, 'border-border-strong/60', tone.wash)}>
      <span
        className="relative inline-flex h-[3.25rem] w-10 flex-col items-center justify-end rounded-[5px] bg-surface pb-1.5 shadow-sm ring-1 ring-black/[0.06] [clip-path:polygon(0_0,68%_0,100%_24%,100%_100%,0_100%)] dark:bg-surface-secondary"
        aria-hidden="true"
      >
        <span className="absolute right-0 top-0 size-3 rounded-bl-[4px] bg-black/[0.08]" />
        {/* a few faint lines of "text" on the page */}
        <span className="mb-1.5 flex w-6 flex-col gap-[3px]">
          <span className="h-[2px] rounded-full bg-text-muted/25" />
          <span className="h-[2px] w-4/5 rounded-full bg-text-muted/20" />
        </span>
        <span className={cn('rounded-[3px] px-1 text-[8px] font-bold leading-3 tracking-wide text-primary-fg', tone.badge)}>{ext}</span>
      </span>
    </div>
  );
}
