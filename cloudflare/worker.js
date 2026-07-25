const API_PATH = "/api/galerie-reihenfolge";
const MAX_BODY_LENGTH = 10000;
const MAX_IDS = 100;
const ID_PATTERN = /^[A-Za-z0-9_-]+$/;

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders
    }
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const allowed = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!origin || !allowed.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

async function tokenIsValid(request, expectedToken) {
  if (!expectedToken) return false;
  const authorization = request.headers.get("Authorization") || "";
  const suppliedToken = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  const encoder = new TextEncoder();
  const [suppliedDigest, expectedDigest] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(suppliedToken)),
    crypto.subtle.digest("SHA-256", encoder.encode(expectedToken))
  ]);
  const supplied = new Uint8Array(suppliedDigest);
  const expected = new Uint8Array(expectedDigest);
  let difference = supplied.length ^ expected.length;

  for (let index = 0; index < Math.min(supplied.length, expected.length); index += 1) {
    difference |= supplied[index] ^ expected[index];
  }
  return difference === 0;
}

function validiereReihenfolge(value) {
  if (!Array.isArray(value) || value.length > MAX_IDS) return false;
  const uniqueIds = new Set();

  for (const id of value) {
    if (typeof id !== "string" || !ID_PATTERN.test(id) || uniqueIds.has(id)) return false;
    uniqueIds.add(id);
  }
  return true;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = corsHeaders(request, env);

    if (url.pathname !== API_PATH) {
      return json({ fehler: "Nicht gefunden." }, 404, headers);
    }

    if (request.method === "OPTIONS") {
      if (request.headers.get("Origin") && !headers["Access-Control-Allow-Origin"]) {
        return json({ fehler: "Origin nicht erlaubt." }, 403);
      }
      return new Response(null, { status: 204, headers });
    }

    if (request.method === "GET") {
      const row = await env.DB.prepare(
        "SELECT reihenfolge, aktualisiert_am FROM galerie_reihenfolge WHERE id = 1"
      ).first();

      return json(
        {
          reihenfolge: row ? JSON.parse(row.reihenfolge) : [],
          aktualisiertAm: row?.aktualisiert_am || null
        },
        200,
        headers
      );
    }

    if (request.method !== "PUT") {
      return json({ fehler: "Methode nicht erlaubt." }, 405, {
        Allow: "GET, PUT, OPTIONS",
        ...headers
      });
    }

    if (!(await tokenIsValid(request, env.ADMIN_TOKEN))) {
      return json({ fehler: "Nicht autorisiert." }, 401, headers);
    }

    const contentLength = Number(request.headers.get("Content-Length") || "0");
    if (contentLength > MAX_BODY_LENGTH) {
      return json({ fehler: "Anfrage ist zu groß." }, 413, headers);
    }

    let body;
    try {
      const text = await request.text();
      if (text.length > MAX_BODY_LENGTH) {
        return json({ fehler: "Anfrage ist zu groß." }, 413, headers);
      }
      body = JSON.parse(text);
    } catch {
      return json({ fehler: "Ungültiges JSON." }, 400, headers);
    }

    if (!validiereReihenfolge(body?.reihenfolge)) {
      return json({ fehler: "Ungültige Reihenfolge." }, 400, headers);
    }

    const aktualisiertAm = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO galerie_reihenfolge (id, reihenfolge, aktualisiert_am)
       VALUES (1, ?1, ?2)
       ON CONFLICT(id) DO UPDATE SET
         reihenfolge = excluded.reihenfolge,
         aktualisiert_am = excluded.aktualisiert_am`
    )
      .bind(JSON.stringify(body.reihenfolge), aktualisiertAm)
      .run();

    return json({ gespeichert: true, aktualisiertAm }, 200, headers);
  }
};
