const http = require('http');
const { books, authors } = require('./src/constants');

const host = '0.0.0.0';
const port = 8000;

const requestListener = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  switch (req.url) {
    case "/books":
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'X-Powered-By': 'bacon'
      });
      res.end(books);
      break
    case "/authors":
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'X-Powered-By': 'bacon'
      });
      res.end(authors);
      break
  }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
