export const standardizeChars = (chars: string) =>
  chars
    .replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s*]/gi, '')
    .toLowerCase();
