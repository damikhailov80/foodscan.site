const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');
const net = require('net');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const startPort = 3000;
const maxPort = 3010;

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certificates', 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificates', 'localhost.pem')),
};

const getLocalIpAddress = () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
};

const checkPortAvailable = (port) => {
  return new Promise((resolve) => {
    const testServer = net.createServer();
    
    testServer.once('error', (err) => {
      resolve(false);
    });
    
    testServer.once('listening', () => {
      testServer.close(() => {
        // Небольшая задержка после закрытия, чтобы порт точно освободился
        setTimeout(() => {
          resolve(true);
        }, 100);
      });
    });
    
    // Слушаем на всех интерфейсах (включая IPv6)
    testServer.listen(port);
  });
};

const findAvailablePort = async (currentPort) => {
  if (currentPort > maxPort) {
    throw new Error(`Could not find an available port between ${startPort} and ${maxPort}`);
  }
  
  const available = await checkPortAvailable(currentPort);
  
  if (available) {
    return currentPort;
  }
  
  console.log(`Port ${currentPort} is already in use, trying ${currentPort + 1}...`);
  return findAvailablePort(currentPort + 1);
};

const startServer = async () => {
  const port = await findAvailablePort(startPort);
  
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();
  
  await app.prepare();
  
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      const localIp = getLocalIpAddress();
      console.log(`> Ready on https://${hostname}:${port}`);
      if (localIp) {
        console.log(`> Network: https://${localIp}:${port}`);
      }
    });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
