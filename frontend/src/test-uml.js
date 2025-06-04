// Quick test of UML helpers and structure
import { createUMLAttribute, createUMLMethod, formatAttribute, formatMethod } from './utils/umlHelpers.js';

console.log('Testing UML Helpers...');

// Test attribute creation
const attr = createUMLAttribute('name', 'string', 'public');
console.log('Created attribute:', attr);
console.log('Formatted attribute:', formatAttribute(attr));

// Test method creation  
const method = createUMLMethod('getName', 'string', 'public', []);
console.log('Created method:', method);
console.log('Formatted method:', formatMethod(method));

// Test method with parameters
const methodWithParams = createUMLMethod('setAge', 'void', 'public', [{name: 'age', type: 'int'}]);
console.log('Created method with params:', methodWithParams);
console.log('Formatted method with params:', formatMethod(methodWithParams));

console.log('UML Helpers test completed!');
