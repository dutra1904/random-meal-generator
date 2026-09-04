const VIDEO_ID_PATTERN =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
const BARE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export function extractYoutubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  const fromUrl = trimmed.match(VIDEO_ID_PATTERN);
  if (fromUrl) return fromUrl[1];

  return BARE_ID_PATTERN.test(trimmed) ? trimmed : null;
}
