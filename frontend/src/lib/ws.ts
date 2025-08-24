export function wsUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  // If base is absolute https/http, convert to wss/ws accordingly
  try {
    const u = new URL(base);
    const proto = u.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${u.host}${path.startsWith("/") ? path : `/${path}`}`;
  } catch {
    // Fallback: relative
    if (typeof window !== "undefined") {
      const loc = window.location;
      const proto = loc.protocol === "https:" ? "wss:" : "ws:";
      return `${proto}//${loc.host}${path.startsWith("/") ? path : `/${path}`}`;
    }
    return path;
  }
}

export type WSHandler<T = unknown> = (data: T) => void;

export function connectWS<T = unknown>(path: string, onMessage: WSHandler<T>) {
  let socket: WebSocket | null = null;
  let retries = 0;

  const url = wsUrl(path);

  const connect = () => {
    socket = new WebSocket(url);

    socket.onopen = () => {
      retries = 0;
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data as T);
      } catch {
        // ignore malformed
      }
    };

    socket.onclose = () => {
      // exponential backoff reconnect
      const timeout = Math.min(30000, 1000 * Math.pow(2, retries++));
      setTimeout(connect, timeout);
    };

    socket.onerror = () => {
      try { socket?.close(); } catch {}
    };
  };

  connect();

  return () => {
    try { socket?.close(); } catch {}
    socket = null;
  };
}
