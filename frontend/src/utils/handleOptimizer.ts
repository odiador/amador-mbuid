// Utilidad para calcular los handles más cercanos entre dos nodos UML
import { UMLClass } from '../types/uml';

export function calculateClosestHandles(
  sourceNode: UMLClass,
  targetNode: UMLClass
): { sourceHandle: string; targetHandle: string } {
  const sourceCenter = {
    x: sourceNode.position.x + (sourceNode.dimensions?.width || 200) / 2,
    y: sourceNode.position.y + (sourceNode.dimensions?.height || 150) / 2
  };
  const targetCenter = {
    x: targetNode.position.x + (targetNode.dimensions?.width || 200) / 2,
    y: targetNode.position.y + (targetNode.dimensions?.height || 150) / 2
  };
  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < 50) {
    return {
      sourceHandle: 'right-2',
      targetHandle: 'target-left-2'
    };
  }
  let sourceHandle = '';
  let targetHandle = '';
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const normalizedAngle = ((angle % 360) + 360) % 360;
  if (normalizedAngle >= 315 || normalizedAngle < 45) {
    sourceHandle = 'right-2';
    targetHandle = 'target-left-2';
  } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
    sourceHandle = 'bottom-2';
    targetHandle = 'target-top-2';
  } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
    sourceHandle = 'left-2';
    targetHandle = 'target-right-2';
  } else {
    sourceHandle = 'top-2';
    targetHandle = 'target-bottom-2';
  }
  const alignmentThreshold = 20;
  if (Math.abs(dx) < alignmentThreshold) {
    if (dy > 0) {
      sourceHandle = 'bottom-2';
      targetHandle = 'target-top-2';
    } else {
      sourceHandle = 'top-2';
      targetHandle = 'target-bottom-2';
    }
  } else if (Math.abs(dy) < alignmentThreshold) {
    if (dx > 0) {
      sourceHandle = 'right-2';
      targetHandle = 'target-left-2';
    } else {
      sourceHandle = 'left-2';
      targetHandle = 'target-right-2';
    }
  }
  return { sourceHandle, targetHandle };
}

/**
 * Encuentra el handle más cercano a un punto dado para un nodo UML.
 * @param node El nodo UML
 * @param point El punto {x, y} al que buscar el handle más cercano
 * @param type 'source' | 'target'
 * @returns El id del handle más cercano (ej: 'right-2', 'top-1', etc.)
 */
export function getClosestHandleToPoint(
  node: UMLClass,
  point: { x: number; y: number },
  type: 'source' | 'target' = 'source'
): string {
  // Define los offsets relativos de los 3 handles por lado
  const sides = [
    { side: 'top',    positions: [0.25, 0.5, 0.75], axis: 'x', fixed: 'y', value: 0 },
    { side: 'right',  positions: [0.25, 0.5, 0.75], axis: 'y', fixed: 'x', value: (node.dimensions?.width || 200) },
    { side: 'bottom', positions: [0.25, 0.5, 0.75], axis: 'x', fixed: 'y', value: (node.dimensions?.height || 150) },
    { side: 'left',   positions: [0.25, 0.5, 0.75], axis: 'y', fixed: 'x', value: 0 }
  ];
  const handles: { id: string; x: number; y: number }[] = [];
  for (const s of sides) {
    s.positions.forEach((pos, idx) => {
      const id = s.side + '-' + (idx + 1);
      const x = s.axis === 'x'
        ? node.position.x + (node.dimensions?.width || 200) * pos
        : node.position.x + s.value;
      const y = s.axis === 'y'
        ? node.position.y + (node.dimensions?.height || 150) * pos
        : node.position.y + s.value;
      handles.push({
        id: type === 'target' ? `target-${id}` : id,
        x, y
      });
    });
  }
  // Encuentra el handle más cercano al punto
  let minDist = Infinity;
  let closest = handles[0].id;
  for (const h of handles) {
    const dist = Math.hypot(h.x - point.x, h.y - point.y);
    if (dist < minDist) {
      minDist = dist;
      closest = h.id;
    }
  }
  return closest;
}
