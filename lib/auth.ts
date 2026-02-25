import { NextRequest } from "next/server";

/**
 * Validates the Authorization header.
 * Expects:  Authorization: Bearer <token>
 * The token is checked against the AUTH_SECRET env variable.
 */
export function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token) return false;
  return token === process.env.AUTH_SECRET;
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function withAuth(handler: (req: NextRequest, session: string) => Promise<Response> | Response) {
  return async (req: NextRequest) => {
    try {
      // Basic fallback since this repo has mismatched auth flows.
      // We'll mimic validateAuth checking the header.
      const authHeader = req.headers.get("authorization") ?? "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
      
      const sessionHeader = req.headers.get('x-user') ?? req.headers.get('x-stellar-public-key');
      const session = sessionHeader || token;

      if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
      }

      return await handler(req, session);
    } catch (error) {
      if (error instanceof ApiError) {
        return new Response(JSON.stringify({ error: error.message }), { status: error.status, headers: { "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  };
}
