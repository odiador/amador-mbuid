import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { UMLClass } from '../types/uml';
import { formatAttribute, formatMethod } from '../utils/umlHelpers';

interface UMLNodeData {
  umlClass: UMLClass;
  isSelected: boolean;
}

const ResizableUMLNode: React.FC<NodeProps<UMLNodeData>> = ({ 
  data, 
  selected
}) => {
  const { umlClass } = data;
  const [showHandles, setShowHandles] = useState(false);

  // Manejar clic derecho para mostrar handles
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowHandles(true);
    // Ocultar handles después de un tiempo
    setTimeout(() => setShowHandles(false), 5000);
  };

  // Manejar clic normal para ocultar handles
  const handleClick = (e: React.MouseEvent) => {
    if (e.button === 0) { // Clic izquierdo
      setShowHandles(false);
    }
  };

  // Crear el contenido visual de la clase UML
  const formatClassContent = () => {
    let sections = [];
    
    // Nombre de la clase
    sections.push(
      <div key="name" style={{ 
        fontSize: '16px', 
        fontWeight: 'bold', 
        borderBottom: '2px solid #e5e7eb',
        padding: '8px 12px',
        textAlign: 'center',
        background: '#f9fafb'
      }}>
        {umlClass.name}
      </div>
    );

    // Atributos
    if (umlClass.attributes.length > 0) {
      sections.push(
        <div key="attributes" style={{ 
          borderBottom: '1px solid #e5e7eb',
          padding: '8px 12px',
          minHeight: '30px'
        }}>
          {umlClass.attributes.map((attr, index) => (
            <div key={index} style={{ 
              fontSize: '13px',
              fontFamily: 'monospace',
              marginBottom: '4px',
              lineHeight: '1.4'
            }}>
              {formatAttribute(attr)}
            </div>
          ))}
        </div>
      );
    }

    // Métodos
    if (umlClass.methods.length > 0) {
      sections.push(
        <div key="methods" style={{ 
          padding: '8px 12px',
          minHeight: '30px'
        }}>
          {umlClass.methods.map((method, index) => (
            <div key={index} style={{ 
              fontSize: '13px',
              fontFamily: 'monospace',
              marginBottom: '4px',
              lineHeight: '1.4'
            }}>
              {formatMethod(method)}
            </div>
          ))}
        </div>
      );
    }

    return sections;
  };

  return (
    <>
      <NodeResizer
        color="#3b82f6"
        isVisible={selected}
        minWidth={150}
        minHeight={100}
        maxWidth={600}
        maxHeight={800}
        keepAspectRatio={false}
        handleClassName="custom-resize-handle"
        lineClassName="custom-resize-line"
        shouldResize={() => true}
      />
      
      <div 
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        style={{
        background: '#fff',
        border: selected ? '2px solid #3b82f6' : '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#374151',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        boxShadow: selected ? '0 4px 12px rgba(59, 130, 246, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: selected ? 'default' : 'pointer'
      }}>
        {formatClassContent()}
        
        {/* Tooltip para explicar la funcionalidad */}
        {selected && !showHandles && (
          <div style={{
            position: 'absolute',
            top: '-45px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#374151',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            opacity: 0.9,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            border: '1px solid #4b5563'
          }}>
            Clic derecho para mostrar puntos de conexión
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #374151'
            }} />
          </div>
        )}
        
        {/* Tooltip cuando se muestran los handles */}
        {showHandles && (
          <div style={{
            position: 'absolute',
            top: '-45px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#059669',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            opacity: 0.9,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            border: '1px solid #047857'
          }}>
            Arrastra desde un punto azul para conectar
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #059669'
            }} />
          </div>
        )}
        
        {/* Handles para conexiones - solo visibles con clic derecho */}
        {(selected || showHandles) && (
          <>
            <Handle
              type="target"
              position={Position.Top}
              style={{ 
                background: '#3b82f6',
                width: '12px',
                height: '12px',
                border: '2px solid #fff',
                opacity: showHandles ? 1 : 0.7,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                cursor: 'crosshair',
                zIndex: showHandles ? 10 : 5
              }}
              isConnectable={showHandles}
            />
            <Handle
              type="source"
              position={Position.Bottom}
              style={{ 
                background: '#3b82f6',
                width: '12px',
                height: '12px',
                border: '2px solid #fff',
                opacity: showHandles ? 1 : 0.7,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                cursor: 'crosshair',
                zIndex: showHandles ? 10 : 5
              }}
              isConnectable={showHandles}
            />
            <Handle
              type="source"
              position={Position.Left}
              style={{ 
                background: '#3b82f6',
                width: '12px',
                height: '12px',
                border: '2px solid #fff',
                opacity: showHandles ? 1 : 0.7,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                cursor: 'crosshair',
                zIndex: showHandles ? 10 : 5
              }}
              isConnectable={showHandles}
            />
            <Handle
              type="source"
              position={Position.Right}
              style={{ 
                background: '#3b82f6',
                width: '12px',
                height: '12px',
                border: '2px solid #fff',
                opacity: showHandles ? 1 : 0.7,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                cursor: 'crosshair',
                zIndex: showHandles ? 10 : 5
              }}
              isConnectable={showHandles}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ResizableUMLNode;
