const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
    
    try {
      const file = Bun.file('.' + filePath);
      return new Response(file);
    } catch (err) {
      return new Response('File not found', { status: 404 });
    }
  },
});

console.log(`🚀 Server running at http://localhost:${server.port}`);