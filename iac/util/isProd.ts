export function isProd(s?: string) {
  let test: string;
  if (typeof s === 'string') test = s;
  else test = $app.stage;

  return test === 'production';
}
