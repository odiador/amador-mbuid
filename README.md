# AMABUID

No more crashes. No more frustration. Just develop :).


AMABUID es una aplicación web para crear interfaces de usuario dinámicas a partir de modelos JSON. Permite diseñar formularios y UIs de manera visual, validando y generando interfaces automáticamente.

## Características principales
- Editor visual de modelos JSON con validación en tiempo real.
- Renderizado inmediato de formularios usando JSONForms.
- Backend serverless con Cloudflare Workers y API documentada.
- Frontend moderno con React, Vite y Tailwind CSS.

## Instalación rápida
1. Clona el repositorio y entra a la carpeta:
   ```powershell
   git clone <url-del-repo>
   cd amabuid
   ```
2. Instala las dependencias:
   ```powershell
   npm run install:all
   ```
3. Copia el archivo de entorno para el frontend:
   ```powershell
   type frontend\.env.example > frontend\.env.local
   ```
4. Ejecuta el entorno de desarrollo:
   ```powershell
   npm run dev
   ```

## Scripts útiles
- `npm run dev` — Inicia backend y frontend juntos
- `npm run build` — Compila todo el proyecto
- `npm run deploy:backend` — Despliega el backend a Cloudflare Workers

## Endpoints principales
- `POST /generar-ui` — Genera la UI desde un modelo JSON
- `GET /health` — Health check

## Licencia
MIT

Para más detalles técnicos, revisa el archivo `README_DETALLADO.md`.
