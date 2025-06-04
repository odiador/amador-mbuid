import { PrimitiveType, UMLAttribute, UMLMethod, Visibility } from '../types/uml';

// Función para crear un atributo con la estructura formal
export function createUMLAttribute(
  name: string, 
  type: string, 
  visibility: Visibility = 'public'
): UMLAttribute {
  return {
    id: `attr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    visibility,
    isStatic: false,
    isReadonly: false
  };
}

// Función para crear un método con la estructura formal
export function createUMLMethod(
  name: string, 
  returnType: string, 
  visibility: Visibility = 'public',
  parameters: Array<{name: string, type: string}> = []
): UMLMethod {
  return {
    id: `method_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    returnType,
    visibility,
    isStatic: false,
    isAbstract: false,
    parameters: parameters.map(param => ({
      name: param.name,
      type: param.type
    }))
  };
}

// Función para parsear string legacy "name: type" a UMLAttribute
export function parseAttributeFromString(attrString: string): UMLAttribute {
  const parts = attrString.split(':').map(p => p.trim());
  const name = parts[0] || 'field';
  const type = parts[1] || 'string';
  
  return createUMLAttribute(name, type);
}

// Función para parsear string legacy "methodName(): returnType" a UMLMethod
export function parseMethodFromString(methodString: string): UMLMethod {
  const match = methodString.match(/^(.+?)\((.*?)\):\s*(.+)$/);
  
  if (match) {
    const [, name, paramsStr, returnType] = match;
    const parameters = paramsStr
      .split(',')
      .map(p => p.trim())
      .filter(p => p)
      .map(p => {
        const paramParts = p.split(':').map(part => part.trim());
        return {
          name: paramParts[0] || 'param',
          type: paramParts[1] || 'string'
        };
      });
    
    return createUMLMethod(name.trim(), returnType.trim(), 'public', parameters);
  }
  
  // Fallback para métodos sin parámetros explícitos
  const simpleName = methodString.replace(/\(\).*/, '').trim();
  return createUMLMethod(simpleName, 'void');
}

// Función para formatear un atributo para mostrar en el diagrama
export function formatAttribute(attr: UMLAttribute): string {
  const visibilitySymbol = {
    'public': '+',
    'private': '-',
    'protected': '#',
    'package': '~'
  }[attr.visibility];
  
  const staticPrefix = attr.isStatic ? 'static ' : '';
  const readonlyPrefix = attr.isReadonly ? 'readonly ' : '';
  
  return `${visibilitySymbol} ${staticPrefix}${readonlyPrefix}${attr.name}: ${attr.type}`;
}

// Función para formatear un método para mostrar en el diagrama
export function formatMethod(method: UMLMethod): string {
  const visibilitySymbol = {
    'public': '+',
    'private': '-',
    'protected': '#',
    'package': '~'
  }[method.visibility];
  
  const staticPrefix = method.isStatic ? 'static ' : '';
  const abstractPrefix = method.isAbstract ? 'abstract ' : '';
  
  const paramsStr = method.parameters
    .map(p => `${p.name}: ${p.type}`)
    .join(', ');
  
  return `${visibilitySymbol} ${staticPrefix}${abstractPrefix}${method.name}(${paramsStr}): ${method.returnType}`;
}

// Tipos primitivos disponibles
export const PRIMITIVE_TYPES: PrimitiveType[] = [
  'string', 'int', 'float', 'double', 'boolean', 'Date', 'char', 'byte', 'long', 'void'
];

// Tipos de visibilidad disponibles
export const VISIBILITY_OPTIONS: Visibility[] = ['public', 'private', 'protected', 'package'];
