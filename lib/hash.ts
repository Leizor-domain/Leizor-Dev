import crypto from 'crypto';

export function generateHash(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

export function generateNewsId(title: string, url: string, publishedAt?: string): string {
  const input = `${title}|${url}|${publishedAt || ''}`;
  return generateHash(input);
}

export function deduplicateNewsItems(items: any[]): any[] {
  const seen = new Set<string>();
  const unique: any[] = [];
  
  for (const item of items) {
    const id = generateNewsId(item.title, item.url, item.publishedAt);
    if (!seen.has(id)) {
      seen.add(id);
      unique.push({ ...item, id });
    }
  }
  
  return unique;
}
