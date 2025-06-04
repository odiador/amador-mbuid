import React from 'react';
import { 
  EdgeProps, 
  getBezierPath, 
  getStraightPath,
  getSmoothStepPath,
  BaseEdge,
  EdgeLabelRenderer
} from 'reactflow';

// Straight Edge - Línea recta
export const StraightEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  selected,
  label,
  labelStyle
}) => {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2,
          stroke: selected ? '#ef4444' : style.stroke || '#64748b'
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              fontWeight: 'bold',
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              color: '#374151',
              pointerEvents: 'none',
              maxWidth: '120px',
              textAlign: 'center',
              ...labelStyle
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// Bezier Edge personalizable - Curva suave
export const CustomBezierEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  selected,
  label,
  labelStyle
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: data?.curvature || 0.25,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2,
          stroke: selected ? '#ef4444' : style.stroke || '#3b82f6'
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              fontWeight: 'bold',
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              color: '#374151',
              pointerEvents: 'none',
              maxWidth: '120px',
              textAlign: 'center',
              ...labelStyle
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// Step Edge - Líneas escalonadas
export const StepEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  selected
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: data?.borderRadius || 5,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        ...style,
        strokeWidth: selected ? 3 : 2,
        stroke: selected ? '#ef4444' : style.stroke || '#10b981'
      }}
    />
  );
};

// Animated Edge - Línea animada
export const AnimatedEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  selected
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2,
          stroke: selected ? '#ef4444' : style.stroke || '#8b5cf6',
          strokeDasharray: '5,5',
          animation: 'dashdraw 0.5s linear infinite'
        }}
      />
      <style>
        {`
          @keyframes dashdraw {
            to {
              stroke-dashoffset: -10;
            }
          }
        `}
      </style>
    </>
  );
};

// Aggregation Edge - Con diamante
export const AggregationEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  selected
}) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // Calcular ángulo para el diamante
  const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
  const diamondSize = 8;
  
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2,
          stroke: selected ? '#ef4444' : style.stroke || '#f59e0b'
        }}
      />
      {/* Diamante en el origen */}
      <polygon
        points={`${sourceX},${sourceY-diamondSize} ${sourceX+diamondSize},${sourceY} ${sourceX},${sourceY+diamondSize} ${sourceX-diamondSize},${sourceY}`}
        fill="white"
        stroke={selected ? '#ef4444' : style.stroke || '#f59e0b'}
        strokeWidth="2"
        transform={`rotate(${angle * 180/Math.PI} ${sourceX} ${sourceY})`}
      />
    </>
  );
};

// Composition Edge - Con diamante relleno
export const CompositionEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  selected
}) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
  const diamondSize = 8;
  
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2,
          stroke: selected ? '#ef4444' : style.stroke || '#dc2626'
        }}
      />
      {/* Diamante relleno en el origen */}
      <polygon
        points={`${sourceX},${sourceY-diamondSize} ${sourceX+diamondSize},${sourceY} ${sourceX},${sourceY+diamondSize} ${sourceX-diamondSize},${sourceY}`}
        fill={selected ? '#ef4444' : style.stroke || '#dc2626'}
        stroke={selected ? '#ef4444' : style.stroke || '#dc2626'}
        strokeWidth="2"
        transform={`rotate(${angle * 180/Math.PI} ${sourceX} ${sourceY})`}
      />
    </>
  );
};

// Inheritance Edge - Con triángulo
export const InheritanceEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  selected
}) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
  const arrowSize = 12;
  
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2,
          stroke: selected ? '#ef4444' : style.stroke || '#6366f1'
        }}
      />
      {/* Triángulo en el destino */}
      <polygon
        points={`${targetX},${targetY} ${targetX-arrowSize},${targetY-arrowSize/2} ${targetX-arrowSize},${targetY+arrowSize/2}`}
        fill="white"
        stroke={selected ? '#ef4444' : style.stroke || '#6366f1'}
        strokeWidth="2"
        transform={`rotate(${angle * 180/Math.PI} ${targetX} ${targetY})`}
      />
    </>
  );
};
