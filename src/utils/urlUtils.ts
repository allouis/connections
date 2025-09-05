export function getBaseUrl(): string {
  // Get the base pathname (handles both root and subdirectory deployments)
  return window.location.pathname.replace(/\/$/, '') || '/';
}

export function createGameUrl(params: URLSearchParams = new URLSearchParams()): string {
  const baseUrl = getBaseUrl();
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export function createAdminUrl(): string {
  const params = new URLSearchParams();
  params.set('admin', 'true');
  return createGameUrl(params);
}