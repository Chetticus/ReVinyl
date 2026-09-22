// lib/jwt.ts
export function verifyJwt(token: string): any | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    return payload;
  } catch {
    return null;
  }
}
