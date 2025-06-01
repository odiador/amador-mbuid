import { createRoute, z } from '@hono/zod-openapi';
import { ModeloFormularioSchema } from './validation';

// Esquema de respuesta para la UI generada
const UIResponseSchema = z.object({
  jsonSchema: z.object({
    type: z.string(),
    title: z.string(),
    description: z.string().optional(),
    properties: z.record(z.any()),
    required: z.array(z.string()).optional(),
  }),
  uiSchema: z.object({
    type: z.string(),
    elements: z.array(z.object({
      type: z.string(),
      label: z.string(),
      scope: z.string(),
      required: z.boolean().optional(),
      options: z.object({
        detail: z.string().optional(),
        placeholder: z.string().optional(),
        enumOptions: z.array(z.object({
          value: z.string(),
          label: z.string(),
        })).optional(),
      }).optional(),
    })),
  }),
});

export const generarUIRoute = createRoute({
  method: 'post',
  path: '/generar-ui',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            modelo: ModeloFormularioSchema,
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UIResponseSchema,
        },
      },
      description: 'UI generada exitosamente',
    },
    400: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            details: z.any().optional(),
          }),
        },
      },
      description: 'Error de validación',
    },
  },
  tags: ['UI Generation'],
  summary: 'Generar interfaz de usuario desde modelo JSON',
  description: 'Recibe un modelo JSON y lo transforma en una estructura de UI compatible con JSONForms',
});
