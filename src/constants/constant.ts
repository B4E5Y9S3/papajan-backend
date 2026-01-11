import ms from "ms";
export const SALTROUND = 10;
export const ACCESS_EXPIRY = "10m";
export const REFRESH_EXPIRY = "30d";

export const ACCESS_EXPIRY_MS = ms(ACCESS_EXPIRY); // For expiry validation
export const REFRESH_EXPIRY_MS = ms(REFRESH_EXPIRY); // For expiry validation
