import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import { UMLClass, UMLModel, UMLRelation } from '../types/uml';
import {
  createUMLAttribute,
  createUMLMethod,
  formatAttribute,
  formatMethod,
  parseAttributeFromString,
  parseMethodFromString,
  PRIMITIVE_TYPES
} from '../utils/umlHelpers';
import { CodeGenerator } from './CodeGenerator';
import { RelationshipPanel } from './RelationshipPanel';
import { EdgeEditPanel } from './EdgeEditPanel';
import ResizableUMLNode from './ResizableUMLNode';
import { 
  StraightEdge, 
  CustomBezierEdge, 
  StepEdge, 
  AnimatedEdge,
  AggregationEdge,
  CompositionEdge,
  InheritanceEdge
} from './CustomEdges';
import { calculateClosestHandles } from '../utils/handleOptimizer';

// Tipos de nodos personalizados
const nodeTypes = {
  umlClass: ResizableUMLNode,
};

// Tipos de edges personalizados
const edgeTypes = {
  straight: StraightEdge,
  default: CustomBezierEdge,
  step: StepEdge,
  animated: AnimatedEdge,
  aggregation: AggregationEdge,
  composition: CompositionEdge,
  inheritance: InheritanceEdge,
};

// Función para convertir UMLRelation a React Flow Edge con estilos específicos
const relationToEdge = (relation: UMLRelation, isSelected: boolean = false, classes?: UMLClass[]): Edge => {
  // Si no hay handles específicos y tenemos las clases disponibles, calcular los más cercanos
  let sourceHandle = relation.sourceHandle;
  let targetHandle = relation.targetHandle;
  
  if ((!sourceHandle || !targetHandle) && classes) {
    const sourceNode = classes.find(c => c.id === relation.source);
    const targetNode = classes.find(c => c.id === relation.target);
    
    if (sourceNode && targetNode) {
      const closest = calculateClosestHandles(sourceNode, targetNode);
      sourceHandle = sourceHandle || closest.sourceHandle;
      targetHandle = targetHandle || closest.targetHandle;
    }
  }

  const baseEdge: Edge = {
    id: relation.id,
    source: relation.source,
    target: relation.target,
    // Usar handles calculados o específicos
    sourceHandle: sourceHandle,
    targetHandle: targetHandle,
    label: relation.label || '',
    selected: isSelected,
    labelStyle: { 
      fontSize: 14, 
      fontWeight: 'bold',
      fill: '#374151',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '4px 8px',
      borderRadius: '4px',
      border: '1px solid #d1d5db'
    }
  };

  // Si hay estilo visual personalizado, usarlo
  if (relation.visualStyle) {
    return {
      ...baseEdge,
      type: relation.visualStyle.edgeType || 'straight',
      style: {
        stroke: relation.visualStyle.color || '#374151',
        strokeWidth: relation.visualStyle.strokeWidth || 1.5,
        ...(relation.visualStyle.strokeDasharray && { strokeDasharray: relation.visualStyle.strokeDasharray })
      },
      data: { 
        relation,
        sourceCardinality: relation.sourceCardinality,
        targetCardinality: relation.targetCardinality
      }
    };
  }

  // Configurar estilos según el tipo de relación UML (por defecto)
  switch (relation.type) {
    case 'inheritance':
      return {
        ...baseEdge,
        type: 'inheritance',
        style: { stroke: '#2563eb', strokeWidth: 2 },
        data: { 
          relation,
          sourceCardinality: relation.sourceCardinality,
          targetCardinality: relation.targetCardinality
        }
      };
    
    case 'composition':
      return {
        ...baseEdge,
        type: 'composition',
        style: { stroke: '#7c2d12', strokeWidth: 2 },
        data: {
          relation,
          sourceCardinality: relation.sourceCardinality,
          targetCardinality: relation.targetCardinality
        }
      };
    
    case 'aggregation':
      return {
        ...baseEdge,
        type: 'aggregation',
        style: { stroke: '#059669', strokeWidth: 2 },
        data: { 
          relation,
          sourceCardinality: relation.sourceCardinality,
          targetCardinality: relation.targetCardinality
        }
      };
    
    case 'dependency':
      return {
        ...baseEdge,
        type: 'animated',
        style: { stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '5,5' },
        data: { 
          relation,
          sourceCardinality: relation.sourceCardinality,
          targetCardinality: relation.targetCardinality
        }
      };
    
    case 'association':
    default:
      return {
        ...baseEdge,
        type: 'straight',
        style: { stroke: '#374151', strokeWidth: 1.5 },
        data: { 
          relation,
          sourceCardinality: relation.sourceCardinality,
          targetCardinality: relation.targetCardinality
        }
      };
  }
};

const initialClasses: UMLClass[] = [
  {
    id: '1',
    name: 'Person',
    attributes: [
      createUMLAttribute('name', 'string'),
      createUMLAttribute('age', 'int'),
      createUMLAttribute('email', 'string')
    ],
    methods: [
      createUMLMethod('getName', 'string'),
      createUMLMethod('setAge', 'void', 'public', [{name: 'age', type: 'int'}]),
      createUMLMethod('getEmail', 'string')
    ],
    position: { x: 250, y: 150 },
    dimensions: { width: 200, height: 180 }
  },
  {
    id: '2',
    name: 'Student',
    attributes: [
      createUMLAttribute('studentId', 'string'),
      createUMLAttribute('grade', 'float'),
      createUMLAttribute('isActive', 'boolean')
    ],
    methods: [
      createUMLMethod('getStudentId', 'string'),
      createUMLMethod('setGrade', 'void', 'public', [{name: 'grade', type: 'float'}]),
      createUMLMethod('isEnrolled', 'boolean')
    ],
    position: { x: 550, y: 150 },
    dimensions: { width: 220, height: 200 }
  },
  {
    id: '3',
    name: 'Course',
    attributes: [
      createUMLAttribute('code', 'string'),
      createUMLAttribute('title', 'string'),
      createUMLAttribute('credits', 'int'),
      createUMLAttribute('startDate', 'Date')
    ],
    methods: [
      createUMLMethod('getCode', 'string'),
      createUMLMethod('getCredits', 'int'),
      createUMLMethod('getDuration', 'int')
    ],
    position: { x: 400, y: 350 },
    dimensions: { width: 240, height: 220 }
  }
];

const initialRelations: UMLRelation[] = [
  {
    id: 'rel1',
    type: 'inheritance',
    source: '2',
    target: '1',
    label: 'extends',
    sourceCardinality: '',
    targetCardinality: ''
  },
  {
    id: 'rel2',
    type: 'association',
    source: '2',
    target: '3',
    label: 'enrolls',
    sourceCardinality: '*',
    targetCardinality: '1..*'
  }
];

export default function UMLDiagram() {
  const [classes, setClasses] = useState<UMLClass[]>(initialClasses);
  const [relations, setRelations] = useState<UMLRelation[]>(initialRelations);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [newAttribute, setNewAttribute] = useState('');
  const [newMethod, setNewMethod] = useState('');

  // Estado separado para los nodos de ReactFlow
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Edge editing functions
  const onEdgeTypeChange = useCallback((edgeId: string, newType: string) => {
    // Actualizar el estado de edges inmediatamente para feedback visual
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === edgeId
          ? { ...edge, type: newType }
          : edge
      )
    );
    
    // Actualizar la relación correspondiente con el nuevo estilo visual
    setRelations((rels) =>
      rels.map((rel) =>
        rel.id === edgeId
          ? {
              ...rel,
              visualStyle: {
                ...rel.visualStyle,
                edgeType: newType as any
              }
            }
          : rel
      )
    );
    // selectedEdge será actualizado automáticamente por el useEffect
  }, []);

  const onEdgeStyleChange = useCallback((edgeId: string, newStyle: any) => {
    // Actualizar el estado de edges inmediatamente
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === edgeId
          ? { ...edge, style: { ...edge.style, ...newStyle } }
          : edge
      )
    );
    
    // Actualizar la relación correspondiente
    setRelations((rels) =>
      rels.map((rel) =>
        rel.id === edgeId
          ? {
              ...rel,
              visualStyle: {
                ...rel.visualStyle,
                color: newStyle.stroke || rel.visualStyle?.color,
                strokeWidth: newStyle.strokeWidth || rel.visualStyle?.strokeWidth,
                ...(newStyle.strokeDasharray && { strokeDasharray: newStyle.strokeDasharray })
              }
            }
          : rel
      )
    );
    // selectedEdge será actualizado automáticamente por el useEffect
  }, []);

  const onDeleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    setRelations((rels) => rels.filter((rel) => rel.id !== edgeId));
    setSelectedEdgeId(null); // Esto hará que selectedEdge se actualice automáticamente
  }, []);

  const onLabelChange = useCallback((edgeId: string, label: string) => {
    // Actualizar el estado de edges inmediatamente
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === edgeId
          ? { ...edge, label }
          : edge
      )
    );
    
    // Actualizar la relación correspondiente
    setRelations((rels) =>
      rels.map((rel) =>
        rel.id === edgeId
          ? { ...rel, label }
          : rel
      )
    );
    // selectedEdge será actualizado automáticamente por el useEffect
  }, []);

  // Función para recalcular automáticamente los handles de todas las relaciones
  const recalculateAllHandles = useCallback(() => {
    setRelations(prev => 
      prev.map(relation => {
        const sourceNode = classes.find(c => c.id === relation.source);
        const targetNode = classes.find(c => c.id === relation.target);
        
        if (sourceNode && targetNode) {
          const closest = calculateClosestHandles(sourceNode, targetNode);
          return {
            ...relation,
            sourceHandle: closest.sourceHandle,
            targetHandle: closest.targetHandle
          };
        }
        
        return relation;
      })
    );
  }, [classes]);

  // Función separada para manejar cambios de dimensiones cuando termine el resize
  const handleResizeEnd = useCallback((nodeId: string, dimensions: { width: number; height: number }) => {
    setClasses(prev => 
      prev.map(cls => 
        cls.id === nodeId 
          ? { 
              ...cls, 
              dimensions: { 
                width: Math.round(dimensions.width), 
                height: Math.round(dimensions.height) 
              } 
            }
          : cls
      )
    );
    
    // Recalcular handles después de redimensionar
    setTimeout(() => recalculateAllHandles(), 100);
  }, [recalculateAllHandles]);

  // Sincronizar clases con nodos de ReactFlow - usar React.useMemo para evitar recálculos
  const reactFlowNodes = React.useMemo(() => {
    return classes.map((umlClass) => ({
      id: umlClass.id,
      type: 'umlClass',
      position: umlClass.position,
      data: { 
        umlClass,
        isSelected: selectedNodeId === umlClass.id,
        onResizeEnd: handleResizeEnd // Pasar función de resize
      },
      style: {
        width: umlClass.dimensions?.width || 200,
        height: umlClass.dimensions?.height || 150,
      },
      selected: selectedNodeId === umlClass.id,
      draggable: true,
      resizeHandleStyle: {
        background: '#3b82f6',
        border: '2px solid #fff',
        borderRadius: '50%',
        width: '8px',
        height: '8px'
      }
    }));
  }, [classes, selectedNodeId, handleResizeEnd]);

  // Sincronizar relaciones con edges - usar React.useMemo para evitar recálculos
  const reactFlowEdges = React.useMemo(() => {
    return relations.map(relation => 
      relationToEdge(relation, selectedEdgeId === relation.id, classes)
    );
  }, [relations, selectedEdgeId, classes]);

  // Efectos para actualizar estados - Simplificado para evitar bucles
  React.useEffect(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes]);

  React.useEffect(() => {
    setEdges(reactFlowEdges);
  }, [reactFlowEdges]);

  // Obtener la clase seleccionada
  const selectedClass = selectedNodeId ? classes.find(c => c.id === selectedNodeId) : null;
  
  // Obtener la relación seleccionada
  const selectedRelation = selectedEdgeId ? relations.find(r => r.id === selectedEdgeId) : null;

  // Manejadores de cambios en nodos y edges
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Aplicar cambios a los nodos de ReactFlow primero
      setNodes((nds) => applyNodeChanges(changes, nds));
      
      let shouldRecalculateHandles = false;
      
      // Sincronizar solo cambios que NO causarán re-render del useEffect
      changes.forEach(change => {
        if (change.type === 'position' && change.position) {
          setClasses(prev => 
            prev.map(cls => 
              cls.id === change.id 
                ? { ...cls, position: change.position! }
                : cls
            )
          );
          shouldRecalculateHandles = true;
        } else if (change.type === 'select') {
          // Manejar selección de nodos
          if (change.selected) {
            setSelectedNodeId(change.id);
            setSelectedEdgeId(null);
          } else if (selectedNodeId === change.id) {
            setSelectedNodeId(null);
          }
        }
        // REMOVIDO: dimension changes para evitar loop infinito
        // Las dimensiones se sincronizarán cuando termine el resize
      });
      
      // Recalcular handles si algún nodo se movió
      if (shouldRecalculateHandles) {
        setTimeout(() => recalculateAllHandles(), 50);
      }
    },
    [selectedNodeId, recalculateAllHandles]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      // Aplicar cambios a los edges de ReactFlow
      setEdges((eds) => applyEdgeChanges(changes, eds));
      
      // Manejar cambios en edges, incluyendo selección
      changes.forEach(change => {
        if (change.type === 'select') {
          if (change.selected) {
            setSelectedEdgeId(change.id);
            setSelectedNodeId(null);
          } else if (selectedEdgeId === change.id) {
            setSelectedEdgeId(null);
          }
        }
      });
    },
    [selectedEdgeId]
  );

  // Derivar selectedEdge del estado actual de edges de forma reactiva
  React.useEffect(() => {
    if (selectedEdgeId) {
      const edge = edges.find(e => e.id === selectedEdgeId);
      setSelectedEdge(edge || null);
    } else {
      setSelectedEdge(null);
    }
  }, [selectedEdgeId, edges]);

  // Manejar cambios de selección
  const onSelectionChange = useCallback(
    ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
      if (nodes.length > 0) {
        setSelectedNodeId(nodes[0].id);
        setSelectedEdgeId(null);
      } else if (edges.length > 0) {
        setSelectedEdgeId(edges[0].id);
        setSelectedNodeId(null);
      } else {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
      }
    },
    []
  );

  // Manejar conexiones solo cuando es apropiado (no con clic normal)
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        // Encontrar los nodos origen y destino
        const sourceNode = classes.find(c => c.id === connection.source);
        const targetNode = classes.find(c => c.id === connection.target);
        
        // Calcular handles más cercanos si no se especificaron o si los nodos existen
        let sourceHandle = connection.sourceHandle;
        let targetHandle = connection.targetHandle;
        
        if (sourceNode && targetNode) {
          const closest = calculateClosestHandles(sourceNode, targetNode);
          sourceHandle = sourceHandle || closest.sourceHandle;
          targetHandle = targetHandle || closest.targetHandle;
        }

        const newRelation: UMLRelation = {
          id: `rel_${Date.now()}`,
          type: 'association',
          source: connection.source,
          target: connection.target,
          label: '',
          sourceCardinality: '',
          targetCardinality: '',
          // Usar handles calculados o específicos
          sourceHandle: sourceHandle || undefined,
          targetHandle: targetHandle || undefined
        };
        
        setRelations(prev => [...prev, newRelation]);
      }
    },
    [classes]
  );

  // Función para verificar si se permite la conexión
  const isValidConnection = useCallback(
    (connection: Connection) => {
      // Solo permitir conexiones si la fuente y destino están definidos
      return connection.source !== connection.target && 
             connection.source !== null && 
             connection.target !== null;
    },
    []
  );

  // Seleccionar nodo
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  }, []);

  // Seleccionar edge (relación)
  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
    setSelectedEdge(edge);
  }, []);

  // Agregar nueva clase
  const addClass = () => {
    const newClass: UMLClass = {
      id: Date.now().toString(),
      name: 'NewClass',
      attributes: [
        createUMLAttribute('id', 'int'),
        createUMLAttribute('name', 'string'),
        createUMLAttribute('active', 'boolean')
      ],
      methods: [
        createUMLMethod('getId', 'int'),
        createUMLMethod('setName', 'void', 'public', [{name: 'name', type: 'string'}]),
        createUMLMethod('isActive', 'boolean')
      ],
      position: { 
        x: Math.random() * 400 + 200, 
        y: Math.random() * 300 + 100 
      },
      dimensions: { width: 200, height: 180 }
    };
    setClasses([...classes, newClass]);
  };

  // Actualizar nombre de clase
  const updateClassName = (name: string) => {
    if (selectedClass) {
      setClasses(classes.map(c => 
        c.id === selectedClass.id ? { ...c, name } : c
      ));
    }
  };

  // Agregar atributo
  const addAttribute = () => {
    if (selectedClass && newAttribute.trim()) {
      const newAttr = parseAttributeFromString(newAttribute.trim());
      setClasses(classes.map(c =>
        c.id === selectedClass.id 
          ? { ...c, attributes: [...c.attributes, newAttr] }
          : c
      ));
      setNewAttribute('');
    }
  };

  // Remover atributo
  const removeAttribute = (index: number) => {
    if (selectedClass) {
      setClasses(classes.map(c =>
        c.id === selectedClass.id
          ? { ...c, attributes: c.attributes.filter((_, i) => i !== index) }
          : c
      ));
    }
  };

  // Agregar método
  const addMethod = () => {
    if (selectedClass && newMethod.trim()) {
      const newMeth = parseMethodFromString(newMethod.trim());
      setClasses(classes.map(c =>
        c.id === selectedClass.id
          ? { ...c, methods: [...c.methods, newMeth] }
          : c
      ));
      setNewMethod('');
    }
  };

  // Remover método
  const removeMethod = (index: number) => {
    if (selectedClass) {
      setClasses(classes.map(c =>
        c.id === selectedClass.id
          ? { ...c, methods: c.methods.filter((_, i) => i !== index) }
          : c
      ));
    }
  };

  // Eliminar clase seleccionada
  const deleteSelectedClass = () => {
    if (selectedClass) {
      setClasses(classes.filter(c => c.id !== selectedClass.id));
      setSelectedNodeId(null);
    }
  };

  // Actualizar relación UML
  const updateUMLRelation = (updatedRelation: UMLRelation) => {
    setRelations(prev => 
      prev.map(rel => 
        rel.id === updatedRelation.id ? updatedRelation : rel
      )
    );
  };

  // Eliminar relación
  const deleteRelation = (relationId: string) => {
    setRelations(prev => prev.filter(rel => rel.id !== relationId));
    setSelectedEdgeId(null);
  };

  // Exportar modelo UML
  const exportUMLModel = () => {
    const umlModel: UMLModel = {
      classes,
      relations,
      version: '2.0',
      metadata: {
        title: 'UML Diagram',
        description: 'Generated UML model with formal structure',
        author: 'AMABUID',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    };
    
    const dataStr = JSON.stringify(umlModel, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'uml-model.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Importar modelo UML
  const importUMLModel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedData = JSON.parse(content);
          
          // Verificar si es el nuevo formato con relaciones o el formato antiguo con edges
          if (importedData.classes && importedData.relations) {
            // Nuevo formato UMLModel
            setClasses(importedData.classes);
            setRelations(importedData.relations);
          } else if (importedData.classes && importedData.edges) {
            // Formato antiguo - convertir edges a relations
            setClasses(importedData.classes);
            const convertedRelations: UMLRelation[] = importedData.edges.map((edge: any) => ({
              id: edge.id,
              type: 'association', // Tipo por defecto para edges antiguos
              source: edge.source,
              target: edge.target,
              label: edge.label || '',
              sourceCardinality: '',
              targetCardinality: ''
            }));
            setRelations(convertedRelations);
          } else if (Array.isArray(importedData)) {
            // Array de clases solamente
            setClasses(importedData);
            setRelations([]);
          }
          
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
        } catch (error) {
          console.error('Error importing UML model:', error);
          alert('Error al importar el modelo UML');
        }
      };
      reader.readAsText(file);
    }
    
    // Reset input
    event.target.value = '';
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Diagrama principal */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onSelectionChange={onSelectionChange}
          isValidConnection={isValidConnection}
          style={{ background: '#f9fafb' }}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          snapToGrid={true}
          snapGrid={[15, 15]}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <Background />
        </ReactFlow>

        {/* Panel de Debug Temporal */}
        {selectedClass && (
          <div style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '12px',
            maxWidth: '300px',
            zIndex: 1000
          }}>
            <div><strong>Debug Info (Node):</strong></div>
            <div>Selected: {selectedClass.name}</div>
            <div>Dimensions: {selectedClass.dimensions?.width || 'undefined'} x {selectedClass.dimensions?.height || 'undefined'}</div>
            <div>Position: {selectedClass.position.x}, {selectedClass.position.y}</div>
            <div>Node Count: {nodes.length}</div>
          </div>
        )}

        {/* Panel de Debug para Edge */}
        {selectedEdge && (
          <div style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            background: 'rgba(0,0,139,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '12px',
            maxWidth: '300px',
            zIndex: 1000
          }}>
            <div><strong>Debug Info (Edge):</strong></div>
            <div>Selected: {selectedEdge.id}</div>
            <div>Type: {selectedEdge.type || 'default'}</div>
            <div>Source: {selectedEdge.source} → Target: {selectedEdge.target}</div>
            <div>Source Handle: {selectedEdge.sourceHandle || 'none'}</div>
            <div>Target Handle: {selectedEdge.targetHandle || 'none'}</div>
            <div>Label: {selectedEdge.label || 'none'}</div>
            <div>Edge Count: {edges.length}</div>
          </div>
        )}

        {/* Botones de acción */}
        <div style={{ 
          position: 'absolute', 
          top: 10, 
          left: 10, 
          zIndex: 1000,
          display: 'flex',
          gap: '10px'
        }}>
          <button 
            onClick={addClass}
            style={{ 
              background: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: 4, 
              padding: '8px 12px', 
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Agregar Clase
          </button>
          
          <button 
            onClick={exportUMLModel}
            style={{ 
              background: '#059669', 
              color: 'white', 
              border: 'none', 
              borderRadius: 4, 
              padding: '8px 12px', 
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Exportar
          </button>
          
          <label style={{ 
            background: '#7c3aed', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4, 
            padding: '8px 12px', 
            cursor: 'pointer',
            fontSize: 14
          }}>
            Importar
            <input 
              type="file" 
              accept=".json" 
              onChange={importUMLModel}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Panel Lateral - Clases */}
      {selectedClass && (
        <div style={{ 
          width: 350, 
          background: '#fff', 
          borderLeft: '1px solid #e5e7eb', 
          padding: 20,
          overflowY: 'auto'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#374151' }}>
            Editar Clase
          </h3>

          {/* Nombre de la clase */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', color: '#374151' }}>
              Nombre:
            </label>
            <input
              type="text"
              value={selectedClass.name}
              onChange={(e) => updateClassName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 4,
                fontSize: 14
              }}
            />
          </div>

          {/* Atributos */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', color: '#374151' }}>
              Atributos:
            </label>
            
            {/* Sugerencias de tipos primitivos */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 5 }}>Tipos comunes:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {PRIMITIVE_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setNewAttribute(`field: ${type}`)}
                    style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: 3,
                      padding: '3px 6px',
                      cursor: 'pointer',
                      fontSize: 11,
                      color: '#374151'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
              <input
                type="text"
                value={newAttribute}
                onChange={(e) => setNewAttribute(e.target.value)}
                placeholder="nombre: tipo"
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  border: '1px solid #d1d5db',
                  borderRadius: 4,
                  fontSize: 13
                }}
                onKeyPress={(e) => e.key === 'Enter' && addAttribute()}
              />
              <button
                onClick={addAttribute}
                style={{
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                +
              </button>
            </div>
            
            {selectedClass.attributes.map((attr, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                <span style={{ 
                  flex: 1, 
                  padding: '4px 8px', 
                  background: '#f3f4f6', 
                  borderRadius: 3,
                  fontFamily: 'monospace',
                  fontSize: 13 
                }}>
                  {formatAttribute(attr)}
                </span>
                <button
                  onClick={() => removeAttribute(index)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 3,
                    padding: '4px 6px',
                    cursor: 'pointer',
                    fontSize: 11
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Métodos */}
          <div style={{ marginBottom: 30 }}>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', color: '#374151' }}>
              Métodos:
            </label>
            <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
              <input
                type="text"
                value={newMethod}
                onChange={(e) => setNewMethod(e.target.value)}
                placeholder="metodo(): tipo"
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  border: '1px solid #d1d5db',
                  borderRadius: 4,
                  fontSize: 13
                }}
                onKeyPress={(e) => e.key === 'Enter' && addMethod()}
              />
              <button
                onClick={addMethod}
                style={{
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                +
              </button>
            </div>
            
            {selectedClass.methods.map((method, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                <span style={{ 
                  flex: 1, 
                  padding: '4px 8px', 
                  background: '#f3f4f6', 
                  borderRadius: 3,
                  fontFamily: 'monospace',
                  fontSize: 13 
                }}>
                  {formatMethod(method)}
                </span>
                <button
                  onClick={() => removeMethod(index)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 3,
                    padding: '4px 6px',
                    cursor: 'pointer',
                    fontSize: 11
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Botón eliminar clase */}
          <button 
            onClick={deleteSelectedClass} 
            style={{ 
              width: '100%', 
              background: '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: 4, 
              padding: '8px 12px', 
              cursor: 'pointer',
              fontSize: 14,
              marginBottom: 20
            }}
          >
            Eliminar Clase
          </button>

          <CodeGenerator classes={classes} />
        </div>
      )}

      {/* Panel Lateral - Relaciones */}
      {selectedRelation && (
        <RelationshipPanel
          selectedRelation={selectedRelation}
          onUpdateRelation={updateUMLRelation}
          onDeleteRelation={deleteRelation}
          onClose={() => setSelectedEdgeId(null)}
        />
      )}

      {/* Panel Lateral - Edge Editing */}
      {selectedEdge && (
        <EdgeEditPanel
          selectedEdge={selectedEdge}
          onEdgeTypeChange={onEdgeTypeChange}
          onEdgeStyleChange={onEdgeStyleChange}
          onLabelChange={onLabelChange}
          onDeleteEdge={onDeleteEdge}
        />
      )}
    </div>
  );
}
