import React, { useState } from 'react';
import JSZip from 'jszip';
import { UMLClass } from '../types/uml';
import { ReactNodeGenerator } from '../generators/react-node-generator';
import { CodeGenerator as ICodeGenerator } from '../generators/types';

interface CodeGeneratorProps {
  classes: UMLClass[];
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ classes }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState<string>('react-node');
  
  const generators: Record<string, ICodeGenerator> = {
    'react-node': new ReactNodeGenerator(),
  };

  const handleGenerate = async () => {
    if (classes.length === 0) {
      alert('No hay clases UML para generar código');
      return;
    }

    setIsGenerating(true);
    
    try {
      const generator = generators[selectedGenerator];
      if (!generator) {
        throw new Error('Generador no encontrado');
      }

      const files = await generator.generate(classes);
      
      // Crear ZIP con JSZip
      const zip = new JSZip();
      
      files.forEach(file => {
        zip.file(file.path, file.content);
      });
      
      // Generar y descargar ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uml-generated-${selectedGenerator}-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating code:', error);
      alert('Error al generar código: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ 
      background: '#fff', 
      border: '1px solid #e5e7eb', 
      borderRadius: 8, 
      padding: 16, 
      marginBottom: 16 
    }}>
      <h3 style={{ fontWeight: 600, marginBottom: 12, color: '#1f2937' }}>
        Generador de Código
      </h3>
      
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 6, color: '#374151' }}>
          Seleccionar Stack:
        </label>
        <select
          value={selectedGenerator}
          onChange={(e) => setSelectedGenerator(e.target.value)}
          style={{ 
            width: '100%', 
            padding: 8, 
            border: '1px solid #d1d5db', 
            borderRadius: 4, 
            fontSize: 14,
            backgroundColor: 'white'
          }}
        >
          <option value="react-node">React + Node.js</option>
          {/* Aquí se pueden agregar más generadores en el futuro */}
        </select>
      </div>

      <div style={{ marginBottom: 12, fontSize: 14, color: '#6b7280' }}>
        <strong>Clases disponibles:</strong> {classes.length > 0 ? classes.map(c => c.name).join(', ') : 'Ninguna'}
      </div>

      <div style={{ marginBottom: 12, fontSize: 14, color: '#6b7280' }}>
        <strong>Descripción:</strong> {generators[selectedGenerator]?.description || 'No disponible'}
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || classes.length === 0}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: isGenerating || classes.length === 0 ? '#9ca3af' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          fontSize: 14,
          fontWeight: 500,
          cursor: isGenerating || classes.length === 0 ? 'not-allowed' : 'pointer'
        }}
      >
        {isGenerating ? 'Generando...' : `Generar Código ${generators[selectedGenerator]?.name || ''}`}
      </button>

      {classes.length === 0 && (
        <div style={{ 
          marginTop: 8, 
          padding: 8, 
          background: '#fef3c7', 
          border: '1px solid #f59e0b', 
          borderRadius: 4, 
          fontSize: 13, 
          color: '#92400e' 
        }}>
          ⚠️ Crea al menos una clase UML para generar código
        </div>
      )}
    </div>
  );
};
