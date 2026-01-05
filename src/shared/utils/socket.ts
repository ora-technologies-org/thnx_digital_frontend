import { io, Socket } from "socket.io-client";
import { config } from "../../config/env";

let adminSocket: Socket | null = null;
let merchantSocket: Socket | null = null;

// let socket: Socket | null = null;

const getBaseUrl = (): string => {
  return config.apiUrl.replace("/api", "");
};

/**
 * Socket connection options
 */
const getSocketOptions = (token: string) => ({
  auth: { token },
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

/**
 * Setup common socket event handlers
 */
const setupSocketHandlers = (socket: Socket, namespace: string): void => {
  socket.on("connect", () => {
    console.log(`🔌 [${namespace}] Socket connected:`, socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log(`🔌 [${namespace}] Socket disconnected:`, reason);
  });

  socket.on("connect_error", (error) => {
    console.error(`🔌 [${namespace}] Socket connection error:`, error.message);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(
      `🔌 [${namespace}] Socket reconnected after`,
      attemptNumber,
      "attempts",
    );
  });

  socket.on("reconnect_error", (error) => {
    console.error(
      `🔌 [${namespace}] Socket reconnection error:`,
      error.message,
    );
  });
};

/**
 * Connect to admin namespace (for admin users)
 */
export const connectAdminSocket = (token: string): Socket => {
  if (adminSocket?.connected) {
    return adminSocket;
  }

  const baseUrl = getBaseUrl();
  adminSocket = io(`${baseUrl}/admin`, getSocketOptions(token));
  setupSocketHandlers(adminSocket, "admin");

  return adminSocket;
};

/**
 * Get admin socket instance
 */
export const getAdminSocket = (): Socket | null => {
  return adminSocket;
};

/**
 * Disconnect admin socket
 */
export const disconnectAdminSocket = (): void => {
  if (adminSocket) {
    adminSocket.disconnect();
    adminSocket = null;
    console.log("🔌 [admin] Socket disconnected manually");
  }
};

/**
 * Check if admin socket is connected
 */
export const isAdminSocketConnected = (): boolean => {
  return adminSocket?.connected ?? false;
};

/**
 * Connect to merchant namespace (for merchant users)
 */
export const connectMerchantSocket = (token: string): Socket => {
  if (merchantSocket?.connected) {
    return merchantSocket;
  }

  const baseUrl = getBaseUrl();
  merchantSocket = io(`${baseUrl}/merchant`, getSocketOptions(token));
  setupSocketHandlers(merchantSocket, "merchant");

  return merchantSocket;
};

/**
 * Get merchant socket instance
 */
export const getMerchantSocket = (): Socket | null => {
  return merchantSocket;
};

/**
 * Disconnect merchant socket
 */
export const disconnectMerchantSocket = (): void => {
  if (merchantSocket) {
    merchantSocket.disconnect();
    merchantSocket = null;
    console.log("🔌 [merchant] Socket disconnected manually");
  }
};

/**
 * Check if merchant socket is connected
 */
export const isMerchantSocketConnected = (): boolean => {
  return merchantSocket?.connected ?? false;
};

/**
 * @deprecated Use connectAdminSocket or connectMerchantSocket instead
 * Connect to default namespace (backward compatibility)
 */
export const connectSocket = (token: string): Socket => {
  // For backward compatibility, connect to admin namespace
  return connectAdminSocket(token);
};

/**
 * @deprecated Use getAdminSocket or getMerchantSocket instead
 */
export const getSocket = (): Socket | null => {
  return adminSocket;
};

/**
 * @deprecated Use disconnectAdminSocket or disconnectMerchantSocket instead
 */
export const disconnectSocket = (): void => {
  disconnectAdminSocket();
};

/**
 * @deprecated Use isAdminSocketConnected or isMerchantSocketConnected instead
 */
export const isSocketConnected = (): boolean => {
  return isAdminSocketConnected();
};

/**
 * Disconnect all sockets
 */
export const disconnectAllSockets = (): void => {
  disconnectAdminSocket();
  disconnectMerchantSocket();
};

/**
 * Connect appropriate socket based on user role
 */
export const connectSocketByRole = (
  token: string,
  role: "ADMIN" | "MERCHANT",
): Socket => {
  if (role === "ADMIN") {
    return connectAdminSocket(token);
  } else {
    return connectMerchantSocket(token);
  }
};

/**
 * Get socket by role
 */
export const getSocketByRole = (role: "ADMIN" | "MERCHANT"): Socket | null => {
  if (role === "ADMIN") {
    return getAdminSocket();
  } else {
    return getMerchantSocket();
  }
};

export default {
  connectAdminSocket,
  getAdminSocket,
  disconnectAdminSocket,
  isAdminSocketConnected,
  connectMerchantSocket,
  getMerchantSocket,
  disconnectMerchantSocket,
  isMerchantSocketConnected,
  connectSocket,
  getSocket,
  disconnectSocket,
  isSocketConnected,
  disconnectAllSockets,
  connectSocketByRole,
  getSocketByRole,
};
