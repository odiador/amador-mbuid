# 🗺️ Roadmap: AMABUID - Evolución hacia Modelado Visual UML y Exportación Multi-Stack

## Objetivo General
Permitir a los usuarios modelar visualmente aplicaciones (UI, lógica, dominio) con notación UML, elegir entre diferentes stacks de frontend y backend, y exportar un paquete listo para deploy automático.

---

## 1. Fase de Transición y Análisis
- [ ] Analizar la arquitectura actual basada en JSONForms y Monaco Editor
- [ ] Identificar componentes reutilizables para el nuevo editor visual
- [ ] Definir la notación visual UML adaptada a UI, lógica y dominio
- [ ] Seleccionar la librería de diagramación visual (ej: react-diagrams, JointJS, mxGraph)
- [ ] Especificar los stacks iniciales soportados (ej: React+Node, Vue+Express, Svelte+Cloudflare)

---

## 2. Fase de Implementación del Editor Visual
- [ ] Integrar la librería de diagramación en el frontend (reemplazo/alternativa a Monaco Editor)
- [ ] Implementar la paleta de componentes UML (clases, relaciones, ViewPart, ViewModel, UI, Domain, etc.)
- [ ] Permitir edición de propiedades de cada elemento (nombre, tipo, validaciones, etc.)
- [ ] Implementar guardado/carga/exportación del modelo visual (JSON/XMI)
- [ ] Validación visual y reglas de consistencia

---

## 3. Fase de Generación de Código Multi-Stack
- [ ] Crear generadores de código para los stacks seleccionados (frontend y backend)
- [ ] Mapear el modelo visual UML a código fuente (UI, lógica, dominio, endpoints, etc.)
- [ ] Generar archivos de configuración y scripts de build/deploy para cada stack
- [ ] Permitir personalización de opciones de exportación (stack, nombre de proyecto, etc.)

---

## 4. Fase de Exportación y Deploy
- [ ] Empaquetar el código generado en un zip/repositorio listo para deploy
- [ ] Incluir scripts de instalación, build y deploy para cada stack
- [ ] (Opcional) Integrar con plataformas de CI/CD (GitHub Actions, Vercel, Netlify, Cloudflare Pages)
- [ ] Permitir reimportar el modelo visual para edición posterior

---

## 5. Fase de Experiencia de Usuario y Documentación
- [ ] Crear tutoriales y ejemplos de modelado visual y exportación
- [ ] Documentar los stacks soportados y el flujo de trabajo
- [ ] Mejorar la UX del editor visual (drag & drop, zoom, alineación, etc.)
- [ ] Añadir soporte para internacionalización (i18n)

---

## 6. Fase de Extensibilidad y Comunidad
- [ ] Permitir a la comunidad crear y compartir nuevos componentes/paletas
- [ ] Añadir soporte para plugins o integraciones externas
- [ ] Crear un marketplace de plantillas/modelos

---

## 7. Checklist de Entregables
- [ ] Editor visual funcional con paleta UML
- [ ] Exportación multi-stack (al menos 2 stacks frontend y 2 backend)
- [ ] Generación de código y scripts de deploy
- [ ] Documentación y tutoriales
- [ ] Ejemplos de proyectos generados y desplegados
- [ ] Soporte para reimportar y editar modelos
