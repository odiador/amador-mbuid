import React from 'react';
import { Edge } from 'reactflow';

interface EdgeEditPanelProps {
  selectedEdge: Edge | null;
  onEdgeTypeChange: (edgeId: string, newType: string) => void;
  onEdgeStyleChange: (edgeId: string, style: any) => void;
  onDeleteEdge: (edgeId: string) => void;
  onLabelChange?: (edgeId: string, label: string) => void;
}

export const EdgeEditPanel: React.FC<EdgeEditPanelProps> = ({
  selectedEdge,
  onEdgeTypeChange,
  onEdgeStyleChange,
  onDeleteEdge,
  onLabelChange
}) => {
  const [labelValue, setLabelValue] = React.useState(
    typeof selectedEdge?.label === 'string' ? selectedEdge.label : ''
  );

  React.useEffect(() => {
    setLabelValue(typeof selectedEdge?.label === 'string' ? selectedEdge.label : '');
  }, [selectedEdge?.label]);

  if (!selectedEdge) return null;

  const edgeTypes = [
    { value: 'straight', label: '— Recta', color: '#64748b' },
    { value: 'default', label: '⤴ Curva', color: '#3b82f6' },
    { value: 'step', label: '⟘ Escalonada', color: '#10b981' },
    { value: 'animated', label: '⟿ Animada', color: '#8b5cf6' },
    { value: 'aggregation', label: '◇ Agregación', color: '#f59e0b' },
    { value: 'composition', label: '◆ Composición', color: '#dc2626' },
    { value: 'inheritance', label: '△ Herencia', color: '#6366f1' }
  ];

  const colors = [
    { value: '#64748b', label: 'Gris' },
    { value: '#3b82f6', label: 'Azul' },
    { value: '#10b981', label: 'Verde' },
    { value: '#f59e0b', label: 'Amarillo' },
    { value: '#dc2626', label: 'Rojo' },
    { value: '#8b5cf6', label: 'Morado' },
    { value: '#06b6d4', label: 'Cian' }
  ];

  const strokeWidths = [1, 2, 3, 4, 5];

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      zIndex: 1000,
      minWidth: '320px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '12px' 
      }}>
        <h4 style={{ 
          margin: '0', 
          fontSize: '16px', 
          color: '#374151',
          fontWeight: 'bold'
        }}>
          ✏️ Editar Conexión
        </h4>
        <button
          onClick={() => onDeleteEdge(selectedEdge.id)}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          🗑️ Eliminar
        </button>
      </div>

      {/* Campo de etiqueta */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '13px', 
          fontWeight: '500',
          color: '#374151',
          marginBottom: '6px' 
        }}>
          Etiqueta:
        </label>
        <input
          type="text"
          value={labelValue}
          onChange={(e) => {
            setLabelValue(e.target.value);
            onLabelChange?.(selectedEdge.id, e.target.value);
          }}
          placeholder="Nombre de la relación..."
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '13px',
            background: '#f9fafb'
          }}
        />
      </div>

      {/* Tipo de conexión */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '13px', 
          fontWeight: '500',
          color: '#374151',
          marginBottom: '6px' 
        }}>
          Tipo de Conexión:
        </label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '4px'
        }}>
          {edgeTypes.map(type => (
            <button
              key={type.value}
              onClick={() => onEdgeTypeChange(selectedEdge.id, type.value)}
              style={{
                background: selectedEdge.type === type.value ? type.color : 'white',
                color: selectedEdge.type === type.value ? 'white' : '#374151',
                border: `1px solid ${type.color}`,
                borderRadius: '6px',
                padding: '6px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '13px', 
          fontWeight: '500',
          color: '#374151',
          marginBottom: '6px' 
        }}>
          Color:
        </label>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {colors.map(color => (
            <button
              key={color.value}
              onClick={() => onEdgeStyleChange(selectedEdge.id, { 
                ...selectedEdge.style, 
                stroke: color.value 
              })}
              style={{
                width: '28px',
                height: '28px',
                background: color.value,
                border: selectedEdge.style?.stroke === color.value ? '3px solid #000' : '2px solid #e5e7eb',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title={color.label}
            />
          ))}
        </div>
      </div>

      {/* Grosor */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '13px', 
          fontWeight: '500',
          color: '#374151',
          marginBottom: '6px' 
        }}>
          Grosor: {selectedEdge.style?.strokeWidth || 2}px
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          {strokeWidths.map(width => (
            <button
              key={width}
              onClick={() => onEdgeStyleChange(selectedEdge.id, { 
                ...selectedEdge.style, 
                strokeWidth: width 
              })}
              style={{
                background: (selectedEdge.style?.strokeWidth || 2) === width ? '#3b82f6' : 'white',
                color: (selectedEdge.style?.strokeWidth || 2) === width ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                minWidth: '32px'
              }}
            >
              {width}
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        fontSize: '11px', 
        color: '#6b7280', 
        textAlign: 'center',
        marginTop: '8px',
        fontStyle: 'italic'
      }}>
        ID: {selectedEdge.id.slice(0, 8)}...
      </div>
    </div>
  );
};
