import { createUMLAttribute, createUMLMethod, formatAttribute, formatMethod, parseAttributeFromString, parseMethodFromString } from '../utils/umlHelpers';
import { UMLClass } from '../types/uml';

// Test function to verify UML structure and helpers
export function testUMLStructure() {
  console.log('🧪 Testing UML Structure...');
  
  // Test attribute creation
  const attr1 = createUMLAttribute('name', 'string', 'public');
  const attr2 = createUMLAttribute('age', 'int', 'private');
  console.log('✅ Created attributes:', attr1, attr2);
  
  // Test formatting
  console.log('📝 Formatted attributes:', formatAttribute(attr1), formatAttribute(attr2));
  
  // Test method creation
  const method1 = createUMLMethod('getName', 'string', 'public');
  const method2 = createUMLMethod('setAge', 'void', 'public', [{name: 'age', type: 'int'}]);
  console.log('✅ Created methods:', method1, method2);
  
  // Test formatting
  console.log('📝 Formatted methods:', formatMethod(method1), formatMethod(method2));
  
  // Test parsing from strings
  const parsedAttr = parseAttributeFromString('email: string');
  const parsedMethod = parseMethodFromString('getEmail(): string');
  console.log('🔍 Parsed from strings:', parsedAttr, parsedMethod);
  
  // Test complete UML class
  const testClass: UMLClass = {
    id: 'test-1',
    name: 'TestClass',
    attributes: [attr1, attr2],
    methods: [method1, method2],
    position: { x: 100, y: 100 }
  };
  
  console.log('🏗️ Complete UML Class:', testClass);
  console.log('✅ UML Structure test completed successfully!');
  
  return testClass;
}

// Export for use in components
export default testUMLStructure;
