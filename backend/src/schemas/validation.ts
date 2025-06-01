import { z } from 'zod';

export const ModeloCampoSchema = z.object({
  tipo: z.enum(['text', 'number', 'email', 'select', 'checkbox', 'textarea']),
  etiqueta: z.string().min(1, 'La etiqueta es requerida'),
  requerido: z.boolean().optional(),
  opciones: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
});

export const ModeloFormularioSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  descripcion: z.string().optional(),
  campos: z.array(ModeloCampoSchema).min(1, 'Debe tener al menos un campo'),
});

export const GenerarUIRequestSchema = z.object({
  modelo: ModeloFormularioSchema,
});

export type ModeloCampo = z.infer<typeof ModeloCampoSchema>;
export type ModeloFormulario = z.infer<typeof ModeloFormularioSchema>;
export type GenerarUIRequest = z.infer<typeof GenerarUIRequestSchema>;
