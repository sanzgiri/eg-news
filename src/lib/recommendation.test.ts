import { describe, expect, it } from 'vitest';
import { dedupeArticles, selectEdition } from './recommendation';
import type { Article } from './types';
const article = (id: string, domain: Article['domain'], score = 1): Article => ({ id, title: id, link: `https://example.com/${id}`, source: 'Test', sourceUrl: 'https://example.com', publishedAt: '2026-10-05T00:00:00Z', domain, summary: '', tags: [], region: 'global', quality: score, reasons: [] });
describe('recommendation policy', () => {
  it('deduplicates normalized URLs', () => expect(dedupeArticles([article('a','technology'), {...article('b','science'), link:'https://example.com/a'}])).toHaveLength(1));
  it('keeps breadth while selecting at most three per domain', () => {
    const domains = ['technology','science','health','india','oregon','culture','world','economy','environment','security'];
    const result = selectEdition(Array.from({length: 20}, (_, i) => article(String(i), i < 10 ? 'technology' : domains[i-10] as any)));
    expect(new Set(result.map(x => x.domain)).size).toBeGreaterThanOrEqual(5);
    const counts = result.reduce<Record<string, number>>((acc, item) => ({...acc, [item.domain]: (acc[item.domain] || 0) + 1}), {});
    expect(Math.max(...Object.values(counts))).toBeLessThanOrEqual(3);
    expect(result).toHaveLength(12);
  });
});
