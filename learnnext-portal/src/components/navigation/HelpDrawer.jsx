import { BookOpenText, Mail, MessageCircle } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Accordion } from '@/components/ui/Accordion';
import { Kbd } from '@/components/ui/Kbd';
import { isMac } from '@/hooks/useHotkey';
import { SUPPORT_EMAIL } from '@/config/app';

const FAQ = [
  { id: 'publish', title: 'How do I publish a course?', content: 'Open Courses, use the row menu on a draft and choose Edit. Set the status to Published and save.' },
  { id: 'invite', title: 'How do I invite an instructor?', content: 'Go to Instructors and select “Invite instructor”. They receive an email to set up their account.' },
  { id: 'export', title: 'Can I export reports?', content: 'Analytics exports are on the roadmap. For now, use the date filter and share the page view.' },
];

export function HelpDrawer({ open, onClose }) {
  const mod = isMac() ? '⌘' : 'Ctrl';
  return (
    <Drawer open={open} onClose={onClose} title="Help & Support" description="Answers, shortcuts and ways to reach us." icon={BookOpenText}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2 sm:grid-cols-2">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-3 rounded-card border border-border p-3.5 transition-colors hover:border-border-strong hover:bg-surface-secondary">
            <Mail className="size-4 text-primary-text" />
            <span>
              <span className="block text-[13px] font-medium text-text">Email support</span>
              <span className="block text-xs text-text-muted">Reply within 1 business day</span>
            </span>
          </a>
          <a href={`mailto:${SUPPORT_EMAIL}?subject=Feedback`} className="flex items-center gap-3 rounded-card border border-border p-3.5 transition-colors hover:border-border-strong hover:bg-surface-secondary">
            <MessageCircle className="size-4 text-primary-text" />
            <span>
              <span className="block text-[13px] font-medium text-text">Send feedback</span>
              <span className="block text-xs text-text-muted">Tell us what to improve</span>
            </span>
          </a>
        </div>
        <section>
          <h3 className="mb-2 text-[13px] font-semibold text-text">Frequently asked</h3>
          <Accordion items={FAQ} defaultOpen={['publish']} />
        </section>
        <section>
          <h3 className="mb-2 text-[13px] font-semibold text-text">Keyboard shortcuts</h3>
          <div className="flex items-center justify-between rounded-card border border-border px-4 py-3 text-[13px] text-text-secondary">
            Open search
            <span className="flex gap-1"><Kbd>{mod}</Kbd><Kbd>K</Kbd></span>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
