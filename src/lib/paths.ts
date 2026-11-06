/**
 * Convert a build-time page path into its public URL path.
 * With `build.format: "file"`, Astro reports `/index.html` and `/technology.html`
 * during the build, but the site is served as `/` and `/technology`.
 */
export function publicPath(pathname: string): string {
  const stripped = pathname
    .replace(/\.html$/, "")
    .replace(/\/index$/, "")
    .replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
}
