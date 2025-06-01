export interface ModeloCampo {
  tipo: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea';
  etiqueta: string;
  requerido?: boolean;
  opciones?: string[];
  placeholder?: string;
}

export interface ModeloFormulario {
  titulo: string;
  descripcion?: string;
  campos: ModeloCampo[];
}

export interface UIField {
  type: string;
  label: string;
  scope: string;
  required?: boolean;
  options?: {
    detail?: string;
    placeholder?: string;
    enumOptions?: Array<{ value: string; label: string }>;
  };
}

export interface UISchema {
  type: string;
  elements: UIField[];
}

export interface JSONSchema {
  type: string;
  properties: Record<string, any>;
  required?: string[];
  title?: string;
  description?: string;
}

export interface UIResponse {
  jsonSchema: JSONSchema;
  uiSchema: UISchema;
}

export interface ApiError {
  error: string;
  details?: string;
}
