import { installWebMCP } from '@mcp-b/webmcp-polyfill';

let installed = false;

/** Install document.modelContext polyfill for local dev (SSR-safe no-op on server). */
export function installWebMcpPolyfill(): void {
  if (typeof document === 'undefined' || installed) return;
  installWebMCP();
  installed = true;
}
