import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { generarUIRoute } from './schemas/openapi';
import { generarUIHandler } from './handlers/ui-generator';

// Crear la aplicación Hono con soporte OpenAPI
const app = new OpenAPIHono();

// Middlewares
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  allowHeaders: ['Content-Type'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
}));

// Rutas principales
app.get('/', (c) => {
  return c.json({
    message: 'AMABUID Backend API',
    version: '1.0.0',
    endpoints: {
      'POST /generar-ui': 'Generar interfaz de usuario desde modelo JSON',
      'GET /openapi.json': 'Especificación OpenAPI',
    },
  });
});

// Ruta para generar UI
app.openapi(generarUIRoute, generarUIHandler);

// Generar documentación OpenAPI
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'AMABUID API',
    description: 'API para Model-Based User Interface Development (MBUID)',
  },
  servers: [
    {
      url: 'https://amabuid-backend.your-domain.workers.dev',
      description: 'Producción',
    },
    {
      url: 'http://localhost:8787',
      description: 'Desarrollo local',
    },
  ],
});

// Health check
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: c.env?.ENVIRONMENT || 'development',
  });
});

// Manejo de errores
app.notFound((c) => {
  return c.json({ error: 'Endpoint no encontrado' }, 404);
});

app.onError((err, c) => {
  console.error('Error no manejado:', err);
  return c.json({ 
    error: 'Error interno del servidor',
    details: err.message,
  }, 500);
});

export default app;
