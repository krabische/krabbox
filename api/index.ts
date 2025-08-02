export default function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Route the request based on the path
  const path = req.url?.replace('/api', '') || '/';
  
  if (path === '/ping') {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
    return;
  }

  if (path === '/demo') {
    // Handle demo route
    res.json({ message: 'Demo endpoint working!' });
    return;
  }

  // Default response for unknown routes
  res.status(404).json({ error: 'Not found' });
} 