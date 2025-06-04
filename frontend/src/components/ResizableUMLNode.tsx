import React, { useState, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { UMLClass } from '../types/uml';
import { formatAttribute, formatMethod } from '../utils/umlHelpers';

interface UMLNodeData {
  umlClass: UMLClass;
  isSelected: boolean;
  onResizeEnd?: (nodeId: string, dimensions: { width: number; height: number }) => void;
}

const ResizableUMLNode: React.FC<NodeProps<UMLNodeData>> = ({ 
  data, 
  selected,
  id
}) => {
  const { umlClass, onResizeEnd } = data;
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);
  const reactFlowInstance = useReactFlow();
  const nodeRef = useRef<HTMLDivElement>(null);

  // Manejar fin de resize
  const handleResizeEnd = (_event: any, params: any) => {
    if (onResizeEnd && params.width && params.height) {
      onResizeEnd(id, { width: params.width, height: params.height });
    }
  };

  // Manejar inicio de drag con clic derecho
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) { // Clic derecho
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      
      // Añadir event listeners globales
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('contextmenu', preventContextMenu);
    }
  };

  // Prevenir menú contextual durante drag
  const preventContextMenu = (e: Event) => {
    e.preventDefault();
  };

  // Manejar movimiento del mouse durante drag
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    // Aquí podrías añadir lógica para mostrar una línea de conexión temporal
    // Por ejemplo, cambiar el cursor o mostrar un indicador visual
  };

  // Manejar fin de drag
  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Limpiar event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('contextmenu', preventContextMenu);
    
    // Buscar si el mouse está sobre otro nodo UML
    const targetElement = document.elementFromPoint(e.clientX, e.clientY);
    const targetNodeElement = targetElement?.closest('.react-flow__node');
    
    if (targetNodeElement && targetNodeElement !== nodeRef.current?.closest('.react-flow__node')) {
      // Encontrar el ID del nodo objetivo
      const targetNodeId = targetNodeElement.getAttribute('data-id');
      
      if (targetNodeId && targetNodeId !== id) {
        // Crear conexión entre nodos
        const newEdge = {
          id: `${id}-${targetNodeId}-${Date.now()}`,
          source: id,
          target: targetNodeId,
          type: 'default',
          style: { stroke: '#3b82f6', strokeWidth: 2 }
        };
        
        try {
          // Añadir la nueva conexión
          reactFlowInstance.addEdges([newEdge]);
        } catch (error) {
          console.error('Error creando conexión:', error);
        }
      }
    }
  };

  // Manejar clic normal para evitar interferencia
  const handleClick = (e: React.MouseEvent) => {
    if (e.button === 0) { // Clic izquierdo - no hacer nada especial
      e.stopPropagation();
    }
  };

  // Helper function to create handle with hover effects
  const createHandle = (
    type: 'source' | 'target',
    position: Position,
    id: string,
    location: string
  ) => {
    const baseOpacity = type === 'source' ? 
      (isDragging || selected ? 0.8 : 0.3) : 
      (isDragging || selected ? 0.6 : 0.2);
    
    const hoverOpacity = type === 'source' ? 1 : 0.8;
    const handleId = `${type}-${id}`;
    const isHovered = hoveredHandle === handleId;
    
    // Determine side for CSS classes
    const side = id.split('-')[0]; // 'top', 'right', 'bottom', 'left'
    
    return (
      <div key={handleId} style={{ position: 'relative' }}>
        <Handle
          type={type}
          position={position}
          id={`${type === 'target' ? 'target-' : ''}${id}`}
          className={`uml-connection-handle ${type} handle-${side} ${
            selected ? 'handle-visible' : 'handle-subtle'
          } ${isHovered ? 'handle-active' : ''}`}
          style={{
            [position === Position.Top || position === Position.Bottom ? 'left' : 'top']: location,
            width: '8px',
            height: '8px',
            opacity: isHovered ? hoverOpacity : baseOpacity,
            zIndex: type === 'source' ? 15 : 14,
            transform: isHovered ? 'scale(1.3)' : 'scale(1)',
            cursor: 'crosshair'
          }}
          onMouseEnter={() => setHoveredHandle(handleId)}
          onMouseLeave={() => setHoveredHandle(null)}
          isConnectable={true}
        />
        
        {/* Individual handle tooltip */}
        {isHovered && (
          <div 
            className="handle-tooltip"
            style={{
              top: position === Position.Top ? '-35px' : 
                   position === Position.Bottom ? '25px' : '-25px',
              left: position === Position.Left ? '25px' : 
                   position === Position.Right ? '-85px' : '-35px'
            }}
          >
            {type === 'source' ? 'Origen' : 'Destino'}: {id.replace('-', ' ')}
          </div>
        )}
      </div>
    );
  };
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
        onResizeEnd={handleResizeEnd}
      />
      
      <div 
        ref={nodeRef}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
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
        cursor: isDragging ? 'crosshair' : (selected ? 'default' : 'pointer'),
        opacity: isDragging ? 0.8 : 1,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)'
      }}>
        {formatClassContent()}
        
        {/* Overlay visual durante el drag */}
        {isDragging && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(59, 130, 246, 0.1)',
            border: '2px dashed #3b82f6',
            borderRadius: '8px',
            zIndex: 5,
            pointerEvents: 'none'
          }} />
        )}
        
        {/* Tooltip para explicar la funcionalidad */}
        {selected && !isDragging && (
          <div style={{
            position: 'absolute',
            top: '-65px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#374151',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            opacity: 0.95,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            border: '1px solid #4b5563',
            maxWidth: '280px',
            textAlign: 'center',
            lineHeight: '1.3'
          }}>
            <div style={{ marginBottom: '4px', fontWeight: '600' }}>
              Múltiples puntos de conexión disponibles
            </div>
            <div style={{ fontSize: '10px', opacity: 0.9 }}>
              Azul: Arriba • Verde: Derecha • Naranja: Abajo • Rojo: Izquierda
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #374151'
            }} />
          </div>
        )}
        
        {/* Tooltip durante el dragging */}
        {isDragging && (
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
            Suelta sobre otro nodo para conectar
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
        
        {/* Connection Handles - Multiple handles per side */}
        {/* Source handles */}
        {createHandle('source', Position.Top, 'top-1', '25%')}
        {createHandle('source', Position.Top, 'top-2', '50%')}
        {createHandle('source', Position.Top, 'top-3', '75%')}
        
        {createHandle('source', Position.Right, 'right-1', '25%')}
        {createHandle('source', Position.Right, 'right-2', '50%')}
        {createHandle('source', Position.Right, 'right-3', '75%')}
        
        {createHandle('source', Position.Bottom, 'bottom-1', '25%')}
        {createHandle('source', Position.Bottom, 'bottom-2', '50%')}
        {createHandle('source', Position.Bottom, 'bottom-3', '75%')}
        
        {createHandle('source', Position.Left, 'left-1', '25%')}
        {createHandle('source', Position.Left, 'left-2', '50%')}
        {createHandle('source', Position.Left, 'left-3', '75%')}

        {/* Target handles */}
        {createHandle('target', Position.Top, 'top-1', '25%')}
        {createHandle('target', Position.Top, 'top-2', '50%')}
        {createHandle('target', Position.Top, 'top-3', '75%')}
        
        {createHandle('target', Position.Right, 'right-1', '25%')}
        {createHandle('target', Position.Right, 'right-2', '50%')}
        {createHandle('target', Position.Right, 'right-3', '75%')}
        
        {createHandle('target', Position.Bottom, 'bottom-1', '25%')}
        {createHandle('target', Position.Bottom, 'bottom-2', '50%')}
        {createHandle('target', Position.Bottom, 'bottom-3', '75%')}
        
        {createHandle('target', Position.Left, 'left-1', '25%')}
        {createHandle('target', Position.Left, 'left-2', '50%')}
        {createHandle('target', Position.Left, 'left-3', '75%')}

        {/* Handles ocultos para ReactFlow - solo para compatibilidad */}
        <Handle
          type="source"
          position={Position.Top}
          style={{ 
            opacity: 0,
            pointerEvents: 'none',
            width: '1px',
            height: '1px'
          }}
          isConnectable={false}
        />
        <Handle
          type="target"
          position={Position.Bottom}
          style={{ 
            opacity: 0,
            pointerEvents: 'none',
            width: '1px',
            height: '1px'
          }}
          isConnectable={false}
        />
      </div>
    </>
  );
};

export default ResizableUMLNode;
