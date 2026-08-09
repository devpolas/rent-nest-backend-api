import type { Request } from "express";
import Bowser from "bowser";

export interface ExtractedSessionInfo {
  browser: string;
  operatingSystem: string;
  deviceType: string;
  ipAddress: string;
  userAgent: string;
}

export function getClientIp(req: Request): string {
  const vercelForwarded = req.headers["x-vercel-forwarded-for"];

  if (typeof vercelForwarded === "string") {
    return normalizeIp(vercelForwarded.split(",")[0]);
  }

  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string") {
    return normalizeIp(forwardedFor.split(",")[0]);
  }

  return normalizeIp(req.ip ?? req.socket.remoteAddress);
}

function normalizeIp(ip?: string): string {
  if (!ip) {
    return "0.0.0.0";
  }

  return ip.trim().replace("::ffff:", "");
}

export function extractSessionInfo(req: Request): ExtractedSessionInfo {
  const userAgent =
    typeof req.headers["user-agent"] === "string"
      ? req.headers["user-agent"]
      : "Unknown";

  const parser = Bowser.getParser(userAgent);

  const browserName = parser.getBrowserName();
  const browserVersion = parser.getBrowserVersion();

  const browser = browserName
    ? `${browserName}${browserVersion ? ` ${browserVersion}` : ""}`
    : "Unknown Browser";

  const osName = parser.getOSName();
  const osVersion = parser.getOSVersion();

  const operatingSystem = osName
    ? `${osName}${osVersion ? ` ${osVersion}` : ""}`
    : "Unknown OS";

  const deviceType = parser.getPlatformType() || "desktop";

  return {
    browser,
    operatingSystem,
    deviceType,
    ipAddress: getClientIp(req),
    userAgent,
  };
}
