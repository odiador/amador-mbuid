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
