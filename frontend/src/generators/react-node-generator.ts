import { UMLClass } from '../types/uml';
import { CodeFile, CodeGenerator } from './types';

// Utilidades para generar código
const toCamelCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);
const toPascalCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

// Mapear tipos UML a TypeScript
const mapUMLTypeToTypeScript = (umlType: string): string => {
  const typeMap: Record<string, string> = {
    'string': 'string',
    'int': 'number',
    'integer': 'number',
    'float': 'number',
    'double': 'number',
    'boolean': 'boolean',
    'Date': 'Date',
    'char': 'string',
    'byte': 'number',
    'long': 'number',
    'void': 'void'
  };
  return typeMap[umlType] || 'any';
};

// Obtener valor por defecto para un tipo
const getDefaultValue = (type: string): string => {
  const tsType = mapUMLTypeToTypeScript(type);
  switch (tsType) {
    case 'string': return "''";
    case 'number': return '0';
    case 'boolean': return 'false';
    case 'Date': return 'new Date()';
    default: return 'null';
  }
};

// Generar modelo TypeScript para Node.js
const generateNodeModel = (umlClass: UMLClass): string => {
  const className = toPascalCase(umlClass.name);
  
  let code = `// ${className} Model\n`;
  code += `export interface I${className} {\n`;
  
  umlClass.attributes.forEach(attr => {
    const tsType = mapUMLTypeToTypeScript(attr.type);
    code += `  ${attr.name}: ${tsType};\n`;
  });
  
  code += `}\n\n`;
  code += `export class ${className} implements I${className} {\n`;
  
  // Propiedades
  umlClass.attributes.forEach(attr => {
    const tsType = mapUMLTypeToTypeScript(attr.type);
    code += `  ${attr.name}: ${tsType};\n`;
  });
  
  code += `\n  constructor(data: Partial<I${className}> = {}) {\n`;
  umlClass.attributes.forEach(attr => {
    const defaultValue = getDefaultValue(attr.type);
    code += `    this.${attr.name} = data.${attr.name} ?? ${defaultValue};\n`;
  });
  code += `  }\n\n`;
  
  // Métodos
  umlClass.methods.forEach(method => {
    const returnType = mapUMLTypeToTypeScript(method.returnType);
    const params = method.parameters.map(p => `${p.name}: ${mapUMLTypeToTypeScript(p.type)}`).join(', ');
    code += `  ${method.name}(${params}): ${returnType} {\n`;
    code += `    // TODO: Implementar ${method.name}\n`;
    code += `    throw new Error('Method not implemented');\n`;
    code += `  }\n\n`;
  });
  
  code += `}\n`;
  return code;
};

// Generar componente React
const generateReactComponent = (umlClass: UMLClass): string => {
  const className = toPascalCase(umlClass.name);
  const componentName = `${className}Component`;
  
  let code = `import React, { useState } from 'react';\n`;
  code += `import { ${className}, I${className} } from '../models/${className}';\n\n`;
  
  code += `interface ${componentName}Props {\n`;
  code += `  ${toCamelCase(className)}?: ${className};\n`;
  code += `  onSave?: (${toCamelCase(className)}: ${className}) => void;\n`;
  code += `}\n\n`;
  
  code += `export const ${componentName}: React.FC<${componentName}Props> = ({ ${toCamelCase(className)}, onSave }) => {\n`;
  code += `  const [formData, setFormData] = useState<I${className}>(${toCamelCase(className)} || new ${className}());\n\n`;
  
  code += `  const handleChange = (field: keyof I${className}, value: any) => {\n`;
  code += `    setFormData(prev => ({ ...prev, [field]: value }));\n`;
  code += `  };\n\n`;
  
  code += `  const handleSubmit = (e: React.FormEvent) => {\n`;
  code += `    e.preventDefault();\n`;
  code += `    const instance = new ${className}(formData);\n`;
  code += `    onSave?.(instance);\n`;
  code += `  };\n\n`;
  
  code += `  return (\n`;
  code += `    <div className="${toKebabCase(className)}-component">\n`;
  code += `      <h2>${className}</h2>\n`;
  code += `      <form onSubmit={handleSubmit}>\n`;
  
  umlClass.attributes.forEach(attr => {
    const tsType = mapUMLTypeToTypeScript(attr.type);
    code += `        <div className="form-group">\n`;
    code += `          <label htmlFor="${attr.name}">${toPascalCase(attr.name)}:</label>\n`;
    
    if (tsType === 'string') {
      code += `          <input\n`;
      code += `            type="text"\n`;
      code += `            id="${attr.name}"\n`;
      code += `            value={formData.${attr.name}}\n`;
      code += `            onChange={(e) => handleChange('${attr.name}', e.target.value)}\n`;
      code += `          />\n`;
    } else if (tsType === 'number') {
      code += `          <input\n`;
      code += `            type="number"\n`;
      code += `            id="${attr.name}"\n`;
      code += `            value={formData.${attr.name}}\n`;
      code += `            onChange={(e) => handleChange('${attr.name}', Number(e.target.value))}\n`;
      code += `          />\n`;
    } else if (tsType === 'boolean') {
      code += `          <input\n`;
      code += `            type="checkbox"\n`;
      code += `            id="${attr.name}"\n`;
      code += `            checked={formData.${attr.name}}\n`;
      code += `            onChange={(e) => handleChange('${attr.name}', e.target.checked)}\n`;
      code += `          />\n`;
    }
    
    code += `        </div>\n`;
  });
  
  code += `        <button type="submit">Guardar ${className}</button>\n`;
  code += `      </form>\n`;
  code += `    </div>\n`;
  code += `  );\n`;
  code += `};\n`;
  
  return code;
};

// Generar API Controller para Node.js
const generateNodeController = (umlClass: UMLClass): string => {
  const className = toPascalCase(umlClass.name);
  const routeName = toKebabCase(umlClass.name);
  
  let code = `import { Request, Response } from 'express';\n`;
  code += `import { ${className} } from '../models/${className}';\n\n`;
  
  code += `export class ${className}Controller {\n`;
  code += `  // GET /${routeName}\n`;
  code += `  static async getAll(req: Request, res: Response) {\n`;
  code += `    try {\n`;
  code += `      // TODO: Implementar lógica de base de datos\n`;
  code += `      const items: ${className}[] = [];\n`;
  code += `      res.json(items);\n`;
  code += `    } catch (error) {\n`;
  code += `      res.status(500).json({ error: 'Error fetching ${routeName}' });\n`;
  code += `    }\n`;
  code += `  }\n\n`;
  
  code += `  // GET /${routeName}/:id\n`;
  code += `  static async getById(req: Request, res: Response) {\n`;
  code += `    try {\n`;
  code += `      const id = req.params.id;\n`;
  code += `      // TODO: Implementar búsqueda por ID\n`;
  code += `      const item = new ${className}();\n`;
  code += `      res.json(item);\n`;
  code += `    } catch (error) {\n`;
  code += `      res.status(500).json({ error: 'Error fetching ${toCamelCase(className)}' });\n`;
  code += `    }\n`;
  code += `  }\n\n`;
  
  code += `  // POST /${routeName}\n`;
  code += `  static async create(req: Request, res: Response) {\n`;
  code += `    try {\n`;
  code += `      const ${toCamelCase(className)} = new ${className}(req.body);\n`;
  code += `      // TODO: Guardar en base de datos\n`;
  code += `      res.status(201).json(${toCamelCase(className)});\n`;
  code += `    } catch (error) {\n`;
  code += `      res.status(500).json({ error: 'Error creating ${toCamelCase(className)}' });\n`;
  code += `    }\n`;
  code += `  }\n\n`;
  
  code += `  // PUT /${routeName}/:id\n`;
  code += `  static async update(req: Request, res: Response) {\n`;
  code += `    try {\n`;
  code += `      const id = req.params.id;\n`;
  code += `      const ${toCamelCase(className)} = new ${className}(req.body);\n`;
  code += `      // TODO: Actualizar en base de datos\n`;
  code += `      res.json(${toCamelCase(className)});\n`;
  code += `    } catch (error) {\n`;
  code += `      res.status(500).json({ error: 'Error updating ${toCamelCase(className)}' });\n`;
  code += `    }\n`;
  code += `  }\n\n`;
  
  code += `  // DELETE /${routeName}/:id\n`;
  code += `  static async delete(req: Request, res: Response) {\n`;
  code += `    try {\n`;
  code += `      const id = req.params.id;\n`;
  code += `      // TODO: Eliminar de base de datos\n`;
  code += `      res.json({ message: '${className} deleted successfully' });\n`;
  code += `    } catch (error) {\n`;
  code += `      res.status(500).json({ error: 'Error deleting ${toCamelCase(className)}' });\n`;
  code += `    }\n`;
  code += `  }\n`;
  code += `}\n`;
  
  return code;
};

// Generar rutas Express
const generateRoutes = (classes: UMLClass[]): string => {
  let code = `import { Router } from 'express';\n`;
  
  classes.forEach(cls => {
    const className = toPascalCase(cls.name);
    code += `import { ${className}Controller } from '../controllers/${className}Controller';\n`;
  });
  
  code += `\nconst router = Router();\n\n`;
  
  classes.forEach(cls => {
    const routeName = toKebabCase(cls.name);
    const className = toPascalCase(cls.name);
    
    code += `// ${className} routes\n`;
    code += `router.get('/${routeName}', ${className}Controller.getAll);\n`;
    code += `router.get('/${routeName}/:id', ${className}Controller.getById);\n`;
    code += `router.post('/${routeName}', ${className}Controller.create);\n`;
    code += `router.put('/${routeName}/:id', ${className}Controller.update);\n`;
    code += `router.delete('/${routeName}/:id', ${className}Controller.delete);\n\n`;
  });
  
  code += `export default router;\n`;
  return code;
};

// Archivos de configuración
const generatePackageJson = (projectName: string): string => {
  return JSON.stringify({
    name: projectName,
    version: "1.0.0",
    description: "Generated from UML model",
    main: "dist/index.js",
    scripts: {
      "build": "tsc",
      "start": "node dist/index.js",
      "dev": "ts-node src/index.ts",
      "test": "jest"
    },
    dependencies: {
      "express": "^4.18.2",
      "cors": "^2.8.5"
    },
    devDependencies: {
      "@types/express": "^4.17.17",
      "@types/cors": "^2.8.13",
      "@types/node": "^20.0.0",
      "typescript": "^5.0.0",
      "ts-node": "^10.9.0"
    }
  }, null, 2);
};

const generateTsConfig = (): string => {
  return JSON.stringify({
    compilerOptions: {
      target: "ES2020",
      module: "commonjs",
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"]
  }, null, 2);
};

const generateMainApp = (_classes: UMLClass[]): string => {
  let code = `import express from 'express';\n`;
  code += `import cors from 'cors';\n`;
  code += `import routes from './routes';\n\n`;
  
  code += `const app = express();\n`;
  code += `const PORT = process.env.PORT || 3000;\n\n`;
  
  code += `// Middleware\n`;
  code += `app.use(cors());\n`;
  code += `app.use(express.json());\n\n`;
  
  code += `// Routes\n`;
  code += `app.use('/api', routes);\n\n`;
  
  code += `// Health check\n`;
  code += `app.get('/health', (req, res) => {\n`;
  code += `  res.json({ status: 'OK', timestamp: new Date().toISOString() });\n`;
  code += `});\n\n`;
  
  code += `app.listen(PORT, () => {\n`;
  code += `  console.log(\`Server running on port \${PORT}\`);\n`;
  code += `});\n`;
  
  return code;
};

// Generador principal
export class ReactNodeGenerator implements CodeGenerator {
  name = 'React + Node.js';
  description = 'Genera aplicación completa con React frontend y Node.js backend';

  async generate(classes: UMLClass[]): Promise<CodeFile[]> {
    const files: CodeFile[] = [];
    
    // Backend Node.js
    classes.forEach(cls => {
      const className = toPascalCase(cls.name);
      
      // Modelo
      files.push({
        path: `backend/src/models/${className}.ts`,
        content: generateNodeModel(cls)
      });
      
      // Controller
      files.push({
        path: `backend/src/controllers/${className}Controller.ts`,
        content: generateNodeController(cls)
      });
    });
    
    // Rutas
    files.push({
      path: 'backend/src/routes/index.ts',
      content: generateRoutes(classes)
    });
    
    // App principal
    files.push({
      path: 'backend/src/index.ts',
      content: generateMainApp(classes)
    });
    
    // Configuración
    files.push({
      path: 'backend/package.json',
      content: generatePackageJson('uml-generated-backend')
    });
    
    files.push({
      path: 'backend/tsconfig.json',
      content: generateTsConfig()
    });
    
    // Frontend React
    classes.forEach(cls => {
      const className = toPascalCase(cls.name);
      
      // Modelo compartido
      files.push({
        path: `frontend/src/models/${className}.ts`,
        content: generateNodeModel(cls)
      });
      
      // Componente React
      files.push({
        path: `frontend/src/components/${className}Component.tsx`,
        content: generateReactComponent(cls)
      });
    });
    
    // App React principal
    let mainApp = `import React from 'react';\n`;
    mainApp += `import './App.css';\n`;
    classes.forEach(cls => {
      const className = toPascalCase(cls.name);
      mainApp += `import { ${className}Component } from './components/${className}Component';\n`;
    });
    
    mainApp += `\nfunction App() {\n`;
    mainApp += `  return (\n`;
    mainApp += `    <div className="App">\n`;
    mainApp += `      <header className="App-header">\n`;
    mainApp += `        <h1>UML Generated App</h1>\n`;
    mainApp += `      </header>\n`;
    mainApp += `      <main>\n`;
    
    classes.forEach(cls => {
      const className = toPascalCase(cls.name);
      mainApp += `        <${className}Component />\n`;
    });
    
    mainApp += `      </main>\n`;
    mainApp += `    </div>\n`;
    mainApp += `  );\n`;
    mainApp += `}\n\n`;
    mainApp += `export default App;\n`;
    
    files.push({
      path: 'frontend/src/App.tsx',
      content: mainApp
    });
    
    // Package.json del frontend
    files.push({
      path: 'frontend/package.json',
      content: JSON.stringify({
        name: 'uml-generated-frontend',
        version: '1.0.0',
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          'react-scripts': '5.0.1'
        },
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test',
          eject: 'react-scripts eject'
        }
      }, null, 2)
    });
    
    // README
    let readme = `# UML Generated Project\n\n`;
    readme += `Este proyecto fue generado automáticamente desde un modelo UML.\n\n`;
    readme += `## Estructura del Proyecto\n\n`;
    readme += `- \`backend/\` - API Node.js con Express\n`;
    readme += `- \`frontend/\` - Aplicación React\n\n`;
    readme += `## Clases Generadas\n\n`;
    
    classes.forEach(cls => {
      readme += `### ${cls.name}\n`;
      readme += `- Atributos: ${cls.attributes.length > 0 ? cls.attributes.join(', ') : 'Ninguno'}\n`;
      readme += `- Métodos: ${cls.methods.length > 0 ? cls.methods.join(', ') : 'Ninguno'}\n\n`;
    });
    
    readme += `## Instalación y Ejecución\n\n`;
    readme += `### Backend\n`;
    readme += `\`\`\`bash\n`;
    readme += `cd backend\n`;
    readme += `npm install\n`;
    readme += `npm run dev\n`;
    readme += `\`\`\`\n\n`;
    readme += `### Frontend\n`;
    readme += `\`\`\`bash\n`;
    readme += `cd frontend\n`;
    readme += `npm install\n`;
    readme += `npm start\n`;
    readme += `\`\`\`\n\n`;
    readme += `## API Endpoints\n\n`;
    
    classes.forEach(cls => {
      const routeName = toKebabCase(cls.name);
      readme += `### ${cls.name}\n`;
      readme += `- GET /api/${routeName} - Listar todos\n`;
      readme += `- GET /api/${routeName}/:id - Obtener por ID\n`;
      readme += `- POST /api/${routeName} - Crear nuevo\n`;
      readme += `- PUT /api/${routeName}/:id - Actualizar\n`;
      readme += `- DELETE /api/${routeName}/:id - Eliminar\n\n`;
    });
    
    files.push({
      path: 'README.md',
      content: readme
    });
    
    return files;
  }
}
