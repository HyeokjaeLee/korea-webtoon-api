export const removeSpecialChars = (str: string) =>
  str.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s*]/gi, '');
