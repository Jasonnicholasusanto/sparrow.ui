import { environment } from "@/lib/utils/env";

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildApiUrl(path: string, version?: string) {
  const base = environment.nextPublicFinforumApiUrl.replace(/\/+$/, "");
  const apiVersion = version || environment.apiVersion;
  return `${base}/api/${apiVersion}${normalizePath(path)}`;
}
