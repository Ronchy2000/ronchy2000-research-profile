// Simple EdgeOne Pages Edge Function health check.
// Route: /api/test
export default function onRequest(context) {
  return new Response(
    JSON.stringify(
      {
        message: "EdgeOne is working!",
        url: context.request.url,
        method: context.request.method,
        time: new Date().toISOString()
      },
      null,
      2
    ),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

