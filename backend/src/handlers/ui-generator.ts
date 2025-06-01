import { Context } from 'hono';
import { ModeloFormulario } from '../types';

export class UIGenerator {
  /**
   * Transforma un modelo de formulario en un esquema JSON y UI Schema compatible con JSONForms
   */
  static generarUI(modelo: ModeloFormulario) {
    const jsonSchema = this.generarJSONSchema(modelo);
    const uiSchema = this.generarUISchema(modelo);

    return {
      jsonSchema,
      uiSchema,
    };
  }

  private static generarJSONSchema(modelo: ModeloFormulario) {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    modelo.campos.forEach((campo, index) => {
      const fieldName = this.generarNombreCampo(campo.etiqueta, index);
      
      // Agregar a required si es necesario
      if (campo.requerido) {
        required.push(fieldName);
      }

      // Configurar propiedades según el tipo
      switch (campo.tipo) {
        case 'text':
        case 'email':
        case 'textarea':
          properties[fieldName] = {
            type: 'string',
            title: campo.etiqueta,
          };
          if (campo.placeholder) {
            properties[fieldName].description = campo.placeholder;
          }
          if (campo.tipo === 'email') {
            properties[fieldName].format = 'email';
          }
          break;

        case 'number':
          properties[fieldName] = {
            type: 'number',
            title: campo.etiqueta,
          };
          if (campo.placeholder) {
            properties[fieldName].description = campo.placeholder;
          }
          break;

        case 'checkbox':
          properties[fieldName] = {
            type: 'boolean',
            title: campo.etiqueta,
          };
          break;

        case 'select':
          properties[fieldName] = {
            type: 'string',
            title: campo.etiqueta,
            enum: campo.opciones || [],
          };
          break;

        default:
          properties[fieldName] = {
            type: 'string',
            title: campo.etiqueta,
          };
      }
    });

    return {
      type: 'object' as const,
      title: modelo.titulo,
      description: modelo.descripcion,
      properties,
      required: required.length > 0 ? required : undefined,
    };
  }

  private static generarUISchema(modelo: ModeloFormulario) {
    const elements = modelo.campos.map((campo, index) => {
      const fieldName = this.generarNombreCampo(campo.etiqueta, index);
      const scope = `#/properties/${fieldName}`;

      const element: any = {
        type: 'Control',
        label: campo.etiqueta,
        scope,
        required: campo.requerido,
      };

      // Opciones específicas por tipo
      const options: any = {};

      if (campo.placeholder) {
        options.placeholder = campo.placeholder;
      }

      switch (campo.tipo) {
        case 'textarea':
          options.multi = true;
          break;

        case 'select':
          if (campo.opciones && campo.opciones.length > 0) {
            options.enumOptions = campo.opciones.map(opcion => ({
              value: opcion,
              label: opcion,
            }));
          }
          break;

        case 'email':
          options.format = 'email';
          break;
      }

      if (Object.keys(options).length > 0) {
        element.options = options;
      }

      return element;
    });

    return {
      type: 'VerticalLayout' as const,
      elements,
    };
  }

  private static generarNombreCampo(etiqueta: string, index: number): string {
    // Convertir etiqueta a un nombre de campo válido
    const nombre = etiqueta
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .replace(/^_+|_+$/g, '');
    
    return nombre || `campo_${index}`;
  }
}

export async function generarUIHandler(c: Context) {
  try {
    const body = await c.req.json();
    const { modelo } = body;

    if (!modelo) {
      return c.json({ error: 'Modelo requerido' }, 400);
    }

    const resultado = UIGenerator.generarUI(modelo);
    
    return c.json(resultado, 200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
  } catch (error) {
    console.error('Error generando UI:', error);
    return c.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, 500);
  }
}
