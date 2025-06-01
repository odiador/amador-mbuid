# AMABUID - Model-Based User Interface Development

No more crashes. No more frustration. Just develop :).

Una aplicación web para desarrollo de interfaces de usuario basadas en modelos JSON. Permite crear formularios dinámicos transformando modelos JSON en interfaces de usuario funcionales usando JSONForms.

## 🚀 Características

- **Backend**: Cloudflare Workers + Hono + TypeScript + Zod
- **Frontend**: React + Vite + Tailwind CSS + JSONForms
- **Editor JSON**: Monaco Editor integrado con validación en tiempo real
- **Vista previa**: Renderización inmediata de la interfaz generada
- **API OpenAPI**: Documentación automática de la API
- **TypeScript**: Tipado completo en todo el proyecto

## 📁 Estructura del proyecto

```
amabuid/
├── backend/                 # Cloudflare Worker con Hono
│   ├── src/
│   │   ├── index.ts        # Punto de entrada
│   │   ├── handlers/       # Handlers de rutas
│   │   ├── schemas/        # Validación y OpenAPI
│   │   └── types/          # Tipos TypeScript
│   ├── package.json
│   ├── tsconfig.json
│   └── wrangler.toml       # Configuración de Cloudflare
├── frontend/               # App React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── services/       # Cliente API
│   │   └── types/          # Tipos compartidos
│   ├── package.json
│   └── vite.config.ts
└── package.json            # Scripts de workspace
```

## 🛠️ Instalación y desarrollo local

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Wrangler CLI (para Cloudflare Workers)

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd amabuid
```

### 2. Instalar dependencias

```bash
npm run install:all
```

### 3. Configurar variables de entorno

```bash
# Frontend
cp frontend/.env.example frontend/.env.local
```

### 4. Desarrollo local

```bash
# Ejecutar backend y frontend simultáneamente
npm run dev

# O ejecutar por separado:
npm run dev:backend   # Puerto 8787
npm run dev:frontend  # Puerto 5173
```

## 🚀 Despliegue

### Backend (Cloudflare Workers)

```bash
cd backend
npm run deploy
```

### Frontend

```bash
cd frontend
npm run build
# Subir carpeta dist/ a tu servicio de hosting favorito
```

## 📖 Uso

1. **Editar modelo JSON**: Usa el editor Monaco para crear tu modelo de formulario
2. **Validación automática**: El JSON se valida en tiempo real
3. **Generar interfaz**: Haz clic en "Generar interfaz" para crear la UI
4. **Vista previa**: Interactúa con el formulario generado
5. **Datos del formulario**: Ve los datos capturados en tiempo real

### Ejemplo de modelo JSON

```json
{
  "titulo": "Formulario de Contacto",
  "descripcion": "Un formulario básico para recopilar información",
  "campos": [
    {
      "tipo": "text",
      "etiqueta": "Nombre completo",
      "requerido": true,
      "placeholder": "Ingresa tu nombre"
    },
    {
      "tipo": "email",
      "etiqueta": "Correo electrónico",
      "requerido": true
    },
    {
      "tipo": "select",
      "etiqueta": "Categoría",
      "opciones": ["Opción 1", "Opción 2", "Opción 3"]
    },
    {
      "tipo": "textarea",
      "etiqueta": "Mensaje",
      "placeholder": "Escribe tu mensaje..."
    },
    {
      "tipo": "checkbox",
      "etiqueta": "Acepto los términos",
      "requerido": true
    }
  ]
}
```

## 🔧 Scripts disponibles

```bash
# Desarrollo
npm run dev                # Backend + Frontend
npm run dev:backend        # Solo backend
npm run dev:frontend       # Solo frontend

# Build
npm run build             # Build completo
npm run build:backend     # Build backend
npm run build:frontend    # Build frontend

# Despliegue
npm run deploy:backend    # Deploy a Cloudflare Workers

# Utilidades
npm run type-check        # Verificar tipos TypeScript
npm run install:all       # Instalar todas las dependencias
```

## 🌐 API Endpoints

- `POST /generar-ui` - Generar interfaz desde modelo JSON
- `GET /health` - Health check del backend
- `GET /openapi.json` - Especificación OpenAPI

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🛟 Soporte

Si tienes preguntas o problemas, por favor abre un issue en el repositorio.
