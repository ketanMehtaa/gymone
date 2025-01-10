import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-me'
);

export async function verifyAuth(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      user: {
        id: payload.id as string,
        email: payload.email as string,
        role: payload.role as string
      }
    };
  } catch (error) {
    return null;
  }
}

export async function signToken(payload: {
  id: string;
  email: string;
  role: string;
}): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return token;
}
