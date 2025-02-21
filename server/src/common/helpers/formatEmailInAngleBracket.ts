export function formateAngleBracketText(text: string | null): string {
  if (!text) {
    return '';
  }
  if (!text.includes('<') && text.split(' ').length === 1) {
    return text;
  }
  if (!text.includes('<')) {
    return text.split(' ')[1];
  }
  const split = text.split('');

  const formatted: string[] = [];

  let angleBracketPassed = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '<') {
      angleBracketPassed = true;
      continue;
    }
    if (!angleBracketPassed) continue;

    if (char === '>') break;
    formatted.push(char);
  }

  return formatted.join('');
}
