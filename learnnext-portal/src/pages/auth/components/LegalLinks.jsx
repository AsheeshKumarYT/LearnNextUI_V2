import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { APP_NAME, SUPPORT_EMAIL } from '@/config/app';

const DOCS = {
  terms: {
    title: 'Terms of Service',
    body: `These placeholder terms describe how training partners may use ${APP_NAME}. Replace this content with your organisation’s legal copy before going live.`,
  },
  privacy: {
    title: 'Privacy Policy',
    body: `${APP_NAME} stores the minimum learner data needed to deliver courses. Replace this placeholder with your published privacy policy.`,
  },
};

/** Footer links for auth pages; opens the documents in a modal (no dead links). */
export function LegalLinks() {
  const [doc, setDoc] = useState(null);
  const current = doc && DOCS[doc];
  const linkCls = 'rounded hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus';
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted">
      <span>© {new Date().getFullYear()} {APP_NAME}</span>
      <div className="flex gap-4">
        <button type="button" className={linkCls} onClick={() => setDoc('terms')}>Terms</button>
        <button type="button" className={linkCls} onClick={() => setDoc('privacy')}>Privacy</button>
        <a className={linkCls} href={`mailto:${SUPPORT_EMAIL}`}>Support</a>
      </div>
      <Modal
        open={Boolean(doc)}
        onClose={() => setDoc(null)}
        title={current?.title}
        footer={<Button onClick={() => setDoc(null)}>Got it</Button>}
      >
        <p className="text-[13.5px] leading-6 text-text-secondary">{current?.body}</p>
      </Modal>
    </footer>
  );
}
