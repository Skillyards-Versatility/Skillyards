const http = require('http');

const data = JSON.stringify({
  date: "2026-07-29",
  data: { notes: "Test report" }
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/eod',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Cookie': 'session=test-token' // We won't be authenticated, but let's see the error
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(res.statusCode, body));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
