export interface DownloadFileOptions {
  url: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: string;
  filename?: string;
  mimeType?: string;
}

export async function downloadFileFromAPI({
  url,
  method = 'GET',
  headers = {},
  body,
  filename,
  mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}: DownloadFileOptions): Promise<void> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(body && { body }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Download failed: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  
  if (arrayBuffer.byteLength === 0) {
    throw new Error('Empty file received');
  }

  const blob = new Blob([arrayBuffer], { type: mimeType });
  const downloadUrl = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || `download_${Date.now()}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

export function generateTimestampedFilename(prefix: string, extension: string): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  return `${prefix}_${timestamp}.${extension}`;
}