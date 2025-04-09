import { console } from "inspector";
import jwt from "jsonwebtoken";
import { DateTime, Duration } from "luxon";

const secretKey = "your-secret-key";

export const encodeJwt = (
  payload: Record<string, unknown>,
  expiresIn: Duration = Duration.fromObject({ hours: 1 })
): string => {
  const expirationTime = DateTime.now().plus(expiresIn);

  return jwt.sign(
    { ...payload, expiresAt: expirationTime.toSeconds() },
    secretKey,
    {
      expiresIn: expiresIn.toMillis() / 1000, // Convert to seconds
    }
  );
};

export const decodeJwt = (token: string): Record<string, unknown> | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as Record<string, unknown>;
    const now = DateTime.now();
    const expiration = DateTime.fromSeconds(decoded.expiresAt as number);

    if (now > expiration) {
      console.error("Token has expired");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
