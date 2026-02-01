export const SITE_URL = "https://palette-planet.com";
export const DEFAULT_TITLE = "palette-planet.com — Premium Brand Directory";
export const DEFAULT_DESCRIPTION =
  "Discover a curated gallery of premium brand logos across tech, lifestyle, wellness, and hospitality. Browse, search, and explore high-end identity systems.";

export const absoluteUrl = (path: string) => {
  if (path.startsWith("http")) {
    return path;
  }
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const truncate = (value: string, length = 160) => {
  if (value.length <= length) {
    return value;
  }
  return `${value.slice(0, length - 1)}…`;
};
