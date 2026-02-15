// Test Edge Function
// Access via: www.ronchy2000.top/api/test
export default function onRequest(context) {
  return new Response(JSON.stringify({
    message: 'EdgeOne is working!',
    path: context.request.url,
    method: context.request.method,
    time: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
