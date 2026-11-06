/** Every public route and a phrase that must appear in its <h1>. */
export const ROUTES = [
  { path: "/", h1: /ProAction/i },
  { path: "/product", h1: /Supply Chain Intelligence/i },
  { path: "/technology", h1: /./ },
  { path: "/company", h1: /Months Before They Happen/i },
  { path: "/company/team", h1: /The Duat Team/i },
  { path: "/why-duat", h1: /./ },
] as const;

/** Third-party requests that can't be reached from CI sandboxes. They're not page errors. */
export const IGNORED_ERROR_SOURCES = /googletagmanager|google-analytics|analytics\.google/;
