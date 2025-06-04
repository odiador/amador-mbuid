// Tipos de datos primitivos soportados
export type PrimitiveType = 'string' | 'int' | 'float' | 'double' | 'boolean' | 'Date' | 'char' | 'byte' | 'long' | 'void';

// Visibilidad de atributos y métodos
export type Visibility = 'public' | 'private' | 'protected' | 'package';

// Interfaz para atributos estructurados
export interface UMLAttribute {
  id: string;
  name: string;
  type: string;
  visibility: Visibility;
  isStatic?: boolean;
  isReadonly?: boolean;
  defaultValue?: string;
}

// Interfaz para métodos estructurados
export interface UMLMethod {
  id: string;
  name: string;
  returnType: string;
  visibility: Visibility;
  isStatic?: boolean;
  isAbstract?: boolean;
  parameters: UMLParameter[];
}

// Interfaz para parámetros de métodos
export interface UMLParameter {
  name: string;
  type: string;
  defaultValue?: string;
}

export interface UMLClass {
  id: string;
  name: string;
  attributes: UMLAttribute[];
  methods: UMLMethod[];
  position: { x: number; y: number };
  dimensions?: { width: number; height: number };
  isAbstract?: boolean;
  stereotype?: string;
}

export interface UMLRelation {
  id: string;
  source: string;
  target: string;
  type: 'association' | 'inheritance' | 'aggregation' | 'composition' | 'dependency';
  label?: string;
  sourceCardinality?: string; // ej: "1", "0..1", "1..*", "*"
  targetCardinality?: string;
  // Información sobre handles específicos usados en la conexión
  sourceHandle?: string; // ej: "top-1", "right-2", etc.
  targetHandle?: string; // ej: "target-bottom-3", etc.
  // Opciones de estilo visual personalizadas
  visualStyle?: {
    edgeType?: 'straight' | 'default' | 'step' | 'animated' | 'aggregation' | 'composition' | 'inheritance';
    color?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  };
}

export interface UMLModel {
  classes: UMLClass[];
  relations: UMLRelation[];
  version: string;
  metadata?: {
    title?: string;
    description?: string;
    author?: string;
    createdAt?: string;
    lastModified?: string;
  };
}
