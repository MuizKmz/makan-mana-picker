/** Google Maps search links. We never list restaurants ourselves, so results are always real. */
export function mapsSearchUrl(what: string, near?: { lat: number; lng: number } | string | null) {
  let query = what;
  if (typeof near === "string" && near.trim()) query = `${what} ${near}`;
  else if (!near) query = `${what} near me`;

  const params = new URLSearchParams({ api: "1", query });
  if (near && typeof near === "object") {
    return `https://www.google.com/maps/search/${encodeURIComponent(what)}/@${near.lat},${near.lng},15z`;
  }
  return `https://www.google.com/maps/search/?${params.toString()}`;
}
