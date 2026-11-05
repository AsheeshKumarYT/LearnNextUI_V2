/**
 * The header's ⌘K global search — generic: it searches whatever `sources` the signed-in portal passes in (each
 * portal defines its own in its folder, e.g. src/portals/training-partner/search.js). Import from '@/services/api'.
 * A source = { key, label, icon, fields, items(), toResult(item) → { id, title, subtitle, to } }.
 */
import { sleep } from '@/utils/helpers';

// How well a record matches: 0 = a field starts with the query, 1 = a word in it does, 2 = it's somewhere inside; null = no match
function matchRank(item, fields, q) {
  let best = null;
  for (const f of fields) {
    const v = String(item[f] ?? '').toLowerCase();
    const at = v.indexOf(q);
    if (at < 0) continue;
    const rank = at === 0 ? 0 : /[\s·,(/-]/.test(v[at - 1]) ? 1 : 2;
    if (best === null || rank < best) best = rank;
  }
  return best;
}

/** Everything matching `query` in `sources`, grouped by source, best matches first; `limit` per group (`total` = how many matched) */
export async function searchAll(query, { limit = 4, sources = [] } = {}) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  await sleep(120);
  return sources
    .map((src) => {
      const hits = src
        .items()
        .map((it) => ({ it, rank: matchRank(it, src.fields, q) }))
        .filter((h) => h.rank !== null)
        .sort((a, b) => a.rank - b.rank);
      return { key: src.key, label: src.label, icon: src.icon, total: hits.length, results: hits.slice(0, limit).map((h) => src.toResult(h.it)) };
    })
    .filter((g) => g.results.length);
}
