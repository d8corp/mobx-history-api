export default function decode (url: string): string {
  return decodeURIComponent(url.replace(/\+/g, ' '))
}