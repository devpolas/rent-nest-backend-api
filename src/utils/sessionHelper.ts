import type { Request } from "express";
import Bowser from "bowser";

export interface ClientInfo {
  userAgent?: string | null;
  language?: string | null;
  languages?: string[];
  timezone?: string | null;
  platform?: string | null;

  screen?: {
    width?: number;
    height?: number;
    pixelRatio?: number;
    colorDepth?: number;
  };

  browser?: {
    online?: boolean;
    cookiesEnabled?: boolean;
  };

  page?: {
    pathname?: string | null;
    referrer?: string | null;
  };
}

export interface ExtractedSessionInfo {
  browser: string;
  operatingSystem: string;
  deviceType: string;

  ipAddress: string;
  userAgent: string;

  language: string;
  timezone: string;
  platform: string;

  screenWidth: number | null;
  screenHeight: number | null;
  pixelRatio: number | null;
  colorDepth: number | null;

  referrer: string | null;
}

function normalizeIp(ip?: string): string {
  if (!ip) {
    return "0.0.0.0";
  }

  return ip
    .trim()
    .replace(/^::ffff:/, "");
}

/**
 * Get the client's IP address.
 *
 * IMPORTANT:
 * Never use X-Client-Info for IP.
 * X-Client-Info is client-controlled.
 */
export function getClientIp(req: Request): string {
  /**
   * Express req.ip is preferred when trust proxy
   * is configured correctly.
   */
  if (req.ip) {
    return normalizeIp(req.ip);
  }

  /**
   * Vercel / reverse proxy fallback.
   */
  const vercelForwarded =
    req.headers["x-vercel-forwarded-for"];

  if (typeof vercelForwarded === "string") {
    return normalizeIp(
      vercelForwarded.split(",")[0],
    );
  }

  /**
   * Standard reverse proxy header.
   */
  const forwardedFor =
    req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string") {
    return normalizeIp(
      forwardedFor.split(",")[0],
    );
  }

  /**
   * Direct connection fallback.
   */
  return normalizeIp(
    req.socket.remoteAddress,
  );
}

/**
 * Safely parse X-Client-Info.
 */
export function getClientInfo(
  req: Request,
): ClientInfo {
  const header =
    req.headers["x-client-info"];

  if (typeof header !== "string") {
    return {};
  }

  try {
    const parsed: unknown =
      JSON.parse(header);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return {};
    }

    return parsed as ClientInfo;
  } catch {
    return {};
  }
}

/**
 * Extract browser/device/session information.
 */
export function extractSessionInfo(
  req: Request,
): ExtractedSessionInfo {
  /**
   * User-Agent comes from the HTTP request.
   *
   * This is more trustworthy than
   * clientInfo.userAgent.
   */
  const userAgent =
    typeof req.headers["user-agent"] ===
    "string"
      ? req.headers["user-agent"]
      : "Unknown";

  /**
   * Parse User-Agent.
   */
  const parser =
    Bowser.getParser(userAgent);

  const browserName =
    parser.getBrowserName();

  const browserVersion =
    parser.getBrowserVersion();

  const browser = browserName
    ? `${browserName}${
        browserVersion
          ? ` ${browserVersion}`
          : ""
      }`
    : "Unknown Browser";

  const osName =
    parser.getOSName();

  const osVersion =
    parser.getOSVersion();

  const operatingSystem = osName
    ? `${osName}${
        osVersion
          ? ` ${osVersion}`
          : ""
      }`
    : "Unknown OS";

  const deviceType =
    parser.getPlatformType() ||
    "desktop";

  /**
   * Browser-provided metadata.
   */
  const clientInfo =
    getClientInfo(req);

  return {
    /**
     * Server-derived information
     */
    browser,
    operatingSystem,
    deviceType,

    ipAddress: getClientIp(req),

    userAgent,

    /**
     * Client-provided information
     */
    language:
      clientInfo.language ??
      "Unknown",

    timezone:
      clientInfo.timezone ??
      "Unknown",

    platform:
      clientInfo.platform ??
      "Unknown",

    screenWidth:
      clientInfo.screen?.width ??
      null,

    screenHeight:
      clientInfo.screen?.height ??
      null,

    pixelRatio:
      clientInfo.screen?.pixelRatio ??
      null,

    colorDepth:
      clientInfo.screen?.colorDepth ??
      null,

    referrer:
      clientInfo.page?.referrer ??
      null,
  };
}
