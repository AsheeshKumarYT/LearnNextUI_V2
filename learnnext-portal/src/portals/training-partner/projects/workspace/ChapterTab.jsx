import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Lock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Card } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CHAPTER_ICONS, STATE_PILL, allSteps, stateLine, stateText } from './workspaceMeta';
import { BasicsStep } from './steps/BasicsStep';
import { ContactsStep } from './steps/ContactsStep';
import { AgreementStep } from './steps/AgreementStep';
import { SessionsStep } from './steps/SessionsStep';
import { ContentStep } from './steps/ContentStep';

const BUILT = { basics: BasicsStep, contacts: ContactsStep, agreement: AgreementStep, sessions: SessionsStep, content: ContentStep };

/** The chapter's progress ring (48px) around its icon */
function ProgressRing({ done, total, icon: Icon }) {
  const r = 21;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative inline-flex size-12 shrink-0 items-center justify-center">
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-12 -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-text-muted/15" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - (total ? done / total : 0))}
          className="text-primary transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary-soft text-primary-text">
        <Icon className="size-4" aria-hidden="true" />
      </span>
    </span>
  );
}

/** A step's number bubble in the steps list */
function Bubble({ step, index, active }) {
  const base = 'relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold';
  if (step.state === 'done') {
    return (
      <span className={cn(base, 'bg-success-main text-white')}>
        <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
      </span>
    );
  }
  if (step.state === 'locked') {
    return (
      <span className={cn(base, 'bg-surface-sunken text-text-muted ring-1 ring-inset ring-border-strong')}>
        <Lock className="size-3" aria-hidden="true" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        base,
        'border-2 bg-surface dark:bg-surface-secondary',
        step.state === 'overdue' ? 'border-danger-main text-danger' : step.state === 'due' ? 'border-warning-main text-warning' : active ? 'border-primary text-primary-text' : 'border-border-strong text-text-secondary',
      )}
      style={active ? { boxShadow: '0 0 0 5px var(--color-primary-soft)' } : undefined}
    >
      {index + 1}
    </span>
  );
}

/** Pinned under the tab bar? (to float the steps panel as a card while it sticks) */
function useStuck(ref) {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const check = () => {
      const el = ref.current;
      if (!el) return;
      const top = parseFloat(getComputedStyle(el).top) || 0;
      setStuck(el.getBoundingClientRect().top <= top + 0.5 && window.scrollY > 0 && getComputedStyle(el).position === 'sticky');
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [ref]);
  return stuck;
}

/**
 * One chapter (Foundation … After delivery): its steps on the left (progress ring, numbered list), the open step on
 * the right — its title and state, the step's own screen (or "on its way"), and Back / Next that move across chapters.
 */
export function ChapterTab({ ws, chapterKey, stepKey, onOpen, onChange }) {
  const chapter = ws.chapters.find((c) => c.key === chapterKey);
  const step = chapter.steps.find((s) => s.key === stepKey) ?? chapter.steps[0];
  const Icon = CHAPTER_ICONS[chapter.key];
  const doneN = chapter.steps.filter((s) => s.state === 'done').length;
  const flat = allSteps(ws.chapters);
  const at = flat.findIndex((s) => s.chapter.key === chapter.key && s.key === step.key);
  const prev = flat[at - 1];
  const next = flat[at + 1];
  const [slot, setSlot] = useState(null); // the header's action area — a step puts its button there
  const asideRef = useRef(null);
  const stuck = useStuck(asideRef);
  const Body = BUILT[step.key];

  return (
    <Card padding="none" flatOnMobile className="grid md:grid-cols-[240px_minmax(0,1fr)] lg:flex-1">
      <aside className="border-border max-md:rounded-t-card max-md:border-b md:rounded-l-card md:border-r md:bg-surface-sunken/70 dark:md:bg-surface-sunken/40">
        <div
          ref={asideRef}
          className={cn(
            'transition-[margin,border-radius,box-shadow,background-color] duration-300 md:sticky md:top-[calc(var(--app-header-h)+var(--page-bar-h,0px))]',
            stuck && 'md:m-2 md:rounded-xl md:border md:border-glass-border md:bg-surface/90 md:shadow-raised md:backdrop-blur-xl dark:md:bg-surface-secondary/90',
          )}
        >
          <div className="flex items-center gap-3 px-4 pb-3 pt-5">
            <ProgressRing done={doneN} total={chapter.steps.length} icon={Icon} />
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-text">{chapter.label}</p>
              <p className="text-xs text-text-secondary">
                {doneN} of {chapter.steps.length} done
              </p>
            </div>
          </div>
          <ol className="flex flex-col px-2 pb-4">
            {chapter.steps.map((s, i) => {
              const active = s.key === step.key;
              return (
                <li key={s.key} className="relative">
                  {i < chapter.steps.length - 1 && (
                    <span className={cn('absolute left-[1.4rem] top-10 h-[calc(100%-1.75rem)] w-0.5 -translate-x-1/2 rounded-full', s.state === 'done' ? 'bg-success-main/40' : 'bg-border-strong')} aria-hidden="true" />
                  )}
                  <button
                    type="button"
                    onClick={() => onOpen(chapter.key, s.key)}
                    aria-current={active ? 'step' : undefined}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      active ? 'bg-primary-soft/70' : 'hover:bg-surface/70 dark:hover:bg-surface-secondary/60',
                    )}
                  >
                    <Bubble step={s} index={i} active={active} />
                    <span className="min-w-0 flex-1 pt-0.5">
                      <span className={cn('block text-[13px]', active ? 'font-semibold text-primary-text' : 'font-medium text-text')}>{s.label}</span>
                      <span className={cn('block truncate text-xs', stateText[s.state] ?? 'text-text-muted')}>{stateLine(s)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>

      <section className="flex min-w-0 flex-col" aria-label={step.label}>
        <div className="flex min-h-[3.75rem] flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-5 py-3 sm:px-6">
          <h2 className="text-base font-semibold text-text">{step.label}</h2>
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', STATE_PILL[step.state])}>{stateLine(step)}</span>
          <div ref={setSlot} className="ml-auto flex items-center gap-2 empty:hidden" />
        </div>

        <div key={`${chapter.key}-${step.key}`} className="flex min-w-0 flex-1 animate-fade-in flex-col">
          {Body ? (
            <Body ws={ws} slot={slot} onChange={onChange} onOpen={onOpen} />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState icon={Icon} title={`${step.label} is on its way`} description="This step’s setup screen hasn’t been built yet." />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-dashed border-border-strong px-5 py-3.5 sm:px-6">
          {prev ? (
            <Button variant="ghost" leftIcon={ArrowLeft} onClick={() => onOpen(prev.chapter.key, prev.key)}>
              <span className="max-sm:hidden">{prev.label}</span>
              <span className="sm:hidden">Back</span>
            </Button>
          ) : (
            <span />
          )}
          {next && (
            <Button variant="secondary" rightIcon={ArrowRight} onClick={() => onOpen(next.chapter.key, next.key)}>
              {next.chapter.key === chapter.key ? next.label : `Next: ${next.chapter.label}`}
            </Button>
          )}
        </div>
      </section>
    </Card>
  );
}
