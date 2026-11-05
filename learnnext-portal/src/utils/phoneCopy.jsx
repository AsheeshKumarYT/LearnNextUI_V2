/**
 * Shorter sub-texts for phones. Header descriptions (cards, modals, drawers, form sections, tab headers, switches) that
 * wrapped onto a second line at phone width get a short version here; the shared headers call `phoneShort(text)`,
 * which shows the short one below sm and the full one from sm up. Keys are the exact full texts.
 * To shorten another one: add `'Full text': 'Short text'` below — no screen needs touching.
 */
const SHORT = {
  // Modals
  'They’ll get a KYC link by email to finish their profile, documents and bank details.': 'We’ll email them a KYC link.',
  // Sign-in
  'Welcome back. Sign in to continue.': 'Welcome back — enter your details.',
  // Filter drawers
  'By who raised it, category, company, reply or date': 'Raised by, category or date',
  'By company, contact, creator or date': 'Company, contact or date',
  'By status, department or enabled': 'Status or department',
  'By status, parent, state or registration type': 'Status, parent or state',
  'By status, expense head, entity or sub-entity': 'Status, head or entity',
  'By learning journey, department or role': 'Journey, department or role',
  'By status, type or who delivers them': 'Status, type or delivery',
  'By entity, mapping or a missing code': 'Entity or mapping',

  // Add / edit client
  'How the company appears across LearnNext.': 'How it appears in LearnNext.',
  'Shown next to the client across LearnNext.': 'Shown next to the client.',
  'The person who will attend the training.': 'Who attends the training.',
  'Optional — helps with records and certificates.': 'Optional, for records.',
  'Inactive clients stay on file but don’t appear in new schedules.': 'Inactive ones skip new schedules.',
  'Inactive clients stay on file but don’t appear in new schedules': 'Inactive ones skip new schedules',
  'Numbers we can reach the company on.': 'How to reach the company.',
  'Where we send letters and certificates.': 'For letters and certificates.',
  'Only if the participant is GST registered.': 'If GST registered.',
  'Add one for each GST registration the company is billed under.': 'One per GST registration.',
  'Only if a lower TDS certificate applies.': 'If a lower TDS rate applies.',
  'Turn on if the client has a lower TDS certificate.': 'For a lower TDS certificate.',
  'This decides which details we ask for next.': 'Decides what we ask next.',

  // Client details tabs
  'Everything that happened with this client, newest first': 'Newest first',
  'People from this client and their learning journeys': 'Their learning journeys',
  'Training projects run for this client': 'Run for this client',
  'Single points of contact and which projects they can see': 'Contacts and their projects',
  'Which products this client can use': 'Products they can use',
  'SPOCs can sign in to see projects and reports.': 'SPOCs see projects and reports.',
  'Schedules, changes and completion reports.': 'Schedules and reports.',
  'Who can sign in and who hears from us': 'Sign-in and emails',
  'Remind participants a day before each session.': 'A day before each session.',
  'Add the client’s points of contact and choose which projects each can see.': 'Contacts and what they see.',

  // Facilitators
  'Where their fees are paid, and their tax details.': 'Fees and tax details.',
  'The firm they work through as a channel partner.': 'Their channel-partner firm.',
  'Who they are and where they live, from their KYC.': 'From their KYC.',
  'Their education, certifications and the programs they’re certified for.': 'Education and certifications.',
  'The industries they’ve worked in, and for how long.': 'Industries and years.',
  'Add a facilitator and we’ll send them a KYC link.': 'We’ll send them a KYC link.',
  'Also pays for one-to-one coaching': 'Plus one-to-one coaching',

  // Manage Content
  'Choose what trainers and participants can do with the content.': 'Who can view or download.',
  'What participants get before, during and after the program.': 'Before, during and after.',

  // Settings masters
  'Add the legal entities that bill programs.': 'Entities that bill programs.',
  'Add the GL code each kind of expense books to.': 'GL codes for expenses.',
  'Add the pages the Training Partner menu shows.': 'Pages in the menu.',
  'Add the parts of the program journey, like Pre, During and Post.': 'Pre, During, Post and more.',
  'Add the groups programs are filed under.': 'How programs are grouped.',
  'Add the units that sit under your entities.': 'Units under your entities.',

  // Profile and app
  'Pick an avatar or upload your own photo.': 'An avatar or your own photo.',
  'Animated scenes or calm still art — pick the one that feels like you.': 'Pick the one that feels like you.',
  'Answers, shortcuts and ways to reach us.': 'Answers and ways to reach us.',
};

/** `text` as-is, or — when a shorter phone version exists — the short one on phones and the full one from sm up */
export function phoneShort(text) {
  const short = typeof text === 'string' ? SHORT[text] : undefined;
  if (!short) return text;
  return (
    <>
      <span className="sm:hidden">{short}</span>
      <span className="max-sm:hidden">{text}</span>
    </>
  );
}
