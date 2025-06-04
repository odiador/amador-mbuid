import React from 'react';
import { UMLRelation } from '../types/uml';

interface RelationshipPanelProps {
  selectedRelation: UMLRelation | null;
  onUpdateRelation: (relation: UMLRelation) => void;
  onDeleteRelation: (relationId: string) => void;
  onClose: () => void;
}
const relationTypes = [
  { 
    value: 'association', 
    label: 'Asociación', 
    description: 'Relación básica entre clases',
    symbol: '→'
  },
  { 
    value: 'inheritance', 
    label: 'Herencia', 
    description: 'Una clase hereda de otra',
    symbol: '▷'
  },
  { 
    value: 'aggregation', 
    label: 'Agregación', 
    description: 'Relación "tiene un" (débil)',
    symbol: '◇'
  },
  { 
    value: 'composition', 
    label: 'Composición', 
    description: 'Relación "compuesto de" (fuerte)',
    symbol: '◆'
  },
  { 
    value: 'dependency', 
    label: 'Dependencia', 
    description: 'Una clase usa otra temporalmente',
    symbol: '- - >'
  }
];

export const RelationshipPanel: React.FC<RelationshipPanelProps> = ({
  selectedRelation,
  onUpdateRelation,
  onDeleteRelation,
  onClose
}) => {
  if (!selectedRelation) return null;

  const handleTypeChange = (newType: UMLRelation['type']) => {
    onUpdateRelation({ ...selectedRelation, type: newType });
  };

  const handleLabelChange = (newLabel: string) => {
    onUpdateRelation({ ...selectedRelation, label: newLabel });
  };

  const handleSourceCardinalityChange = (cardinality: string) => {
    onUpdateRelation({ ...selectedRelation, sourceCardinality: cardinality });
  };

  const handleTargetCardinalityChange = (cardinality: string) => {
    onUpdateRelation({ ...selectedRelation, targetCardinality: cardinality });
  };

  const selectedRelationType = relationTypes.find(t => t.value === selectedRelation.type);

  return (
    <div style={{ 
      width: 320, 
      background: '#fff', 
      borderLeft: '1px solid #e5e7eb', 
      padding: 16, 
      overflowY: 'auto' 
    }}>
      <h3 style={{ fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>
        Editar Relación UML
      </h3>

      {/* Tipo de Relación */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#374151' }}>
          Tipo de Relación
        </label>
        <select
          value={selectedRelation.type}
          onChange={(e) => handleTypeChange(e.target.value as UMLRelation['type'])}
          style={{ 
            width: '100%', 
            padding: 8, 
            border: '1px solid #d1d5db', 
            borderRadius: 4, 
            fontSize: 14,
            backgroundColor: 'white'
          }}
        >
          {relationTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.symbol} {type.label}
            </option>
          ))}
        </select>
        
        {selectedRelationType && (
          <div style={{ 
            marginTop: 6, 
            padding: 8, 
            background: '#f3f4f6', 
            borderRadius: 4, 
            fontSize: 12, 
            color: '#6b7280' 
          }}>
            {selectedRelationType.description}
          </div>
        )}
      </div>

      {/* Etiqueta */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 6, color: '#374151' }}>
          Etiqueta (opcional)
        </label>
        <input
          type="text"
          value={selectedRelation.label || ''}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="ej: usa, contiene, etc."
          style={{ 
            width: '100%', 
            padding: 8, 
            border: '1px solid #d1d5db', 
            borderRadius: 4, 
            fontSize: 14 
          }}
        />
      </div>

      {/* Cardinalidades */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 8, color: '#374151' }}>
          Cardinalidades
        </label>
        
        <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Origen</label>
            <input
              type="text"
              value={selectedRelation.sourceCardinality || ''}
              onChange={(e) => handleSourceCardinalityChange(e.target.value)}
              placeholder="1, *, 0..1"
              style={{ 
                width: '100%', 
                padding: 6, 
                border: '1px solid #d1d5db', 
                borderRadius: 3, 
                fontSize: 13 
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Destino</label>
            <input
              type="text"
              value={selectedRelation.targetCardinality || ''}
              onChange={(e) => handleTargetCardinalityChange(e.target.value)}
              placeholder="1, *, 0..1"
              style={{ 
                width: '100%', 
                padding: 6, 
                border: '1px solid #d1d5db', 
                borderRadius: 3, 
                fontSize: 13 
              }}
            />
          </div>
        </div>
        
        <div style={{ 
          fontSize: 11, 
          color: '#6b7280', 
          marginTop: 4 
        }}>
          Ejemplos: 1 (uno), * (muchos), 0..1 (cero o uno), 1..* (uno o muchos)
        </div>
      </div>

      {/* Información de la Relación */}
      <div style={{ 
        marginBottom: 20, 
        padding: 10, 
        background: '#eff6ff', 
        border: '1px solid #bfdbfe', 
        borderRadius: 4 
      }}>
        <div style={{ fontSize: 12, color: '#1e40af' }}>
          <strong>Relación:</strong> {selectedRelation.source} → {selectedRelation.target}
        </div>
      </div>

      {/* Botones de Acción */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button 
          onClick={onClose} 
          style={{ 
            flex: 1, 
            background: '#f3f4f6', 
            border: '1px solid #d1d5db', 
            borderRadius: 4, 
            padding: '8px 12px', 
            cursor: 'pointer', 
            color: '#374151',
            fontSize: 14
          }}
        >
          Cerrar
        </button>
        <button 
          onClick={() => onDeleteRelation(selectedRelation.id)} 
          style={{ 
            background: '#ef4444', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4, 
            padding: '8px 12px', 
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
