import { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';
import ResizableUMLNode from './components/ResizableUMLNode';
import { UMLClass, UMLRelation } from './types/uml';
import { createUMLAttribute, createUMLMethod } from './utils/umlHelpers';

const nodeTypes = {
  umlClass: ResizableUMLNode,
};

const demoClasses: UMLClass[] = [
  {
    id: 'demo1',
    name: 'Usuario',
    attributes: [
      createUMLAttribute('id', 'string'),
      createUMLAttribute('nombre', 'string'),
      createUMLAttribute('email', 'string'),
      createUMLAttribute('activo', 'boolean'),
    ],
    methods: [
      createUMLMethod('getId', 'string'),
      createUMLMethod('getNombre', 'string'),
      createUMLMethod('setEmail', 'void', 'public', [{name: 'email', type: 'string'}]),
      createUMLMethod('activar', 'void'),
    ],
    position: { x: 100, y: 150 },
    dimensions: { width: 250, height: 200 }
  },
  {
    id: 'demo2',
    name: 'Pedido',
    attributes: [
      createUMLAttribute('numero', 'string'),
      createUMLAttribute('fecha', 'Date'),
      createUMLAttribute('total', 'number'),
      createUMLAttribute('estado', 'string'),
    ],
    methods: [
      createUMLMethod('calcularTotal', 'number'),
      createUMLMethod('confirmar', 'void'),
      createUMLMethod('cancelar', 'void'),
    ],
    position: { x: 450, y: 150 },
    dimensions: { width: 220, height: 180 }
  }
];

const initialNodes: Node[] = demoClasses.map((umlClass) => ({
  id: umlClass.id,
  type: 'umlClass',
  position: umlClass.position,
  data: { 
    umlClass,
    isSelected: false 
  },
  style: {
    width: umlClass.dimensions?.width || 200,
    height: umlClass.dimensions?.height || 150,
  },
  draggable: true,
}));

export const DemoComplete = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [classes, setClasses] = useState<UMLClass[]>(demoClasses);
  const [relations, setRelations] = useState<UMLRelation[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      console.log('Node changes:', changes);
      setNodes((nds) => applyNodeChanges(changes, nds));
      
      // Sincronizar cambios con el estado de clases
      changes.forEach(change => {
        if (change.type === 'position' && change.position) {
          setClasses(prev => 
            prev.map(cls => 
              cls.id === change.id 
                ? { ...cls, position: change.position! }
                : cls
            )
          );
        } else if (change.type === 'dimensions' && change.dimensions) {
          setClasses(prev => 
            prev.map(cls => 
              cls.id === change.id 
                ? { 
                    ...cls, 
                    dimensions: { 
                      width: Math.round(change.dimensions!.width), 
                      height: Math.round(change.dimensions!.height) 
                    } 
                  }
                : cls
            )
          );
        } else if (change.type === 'select') {
          if (change.selected) {
            setSelectedNodeId(change.id);
          } else if (selectedNodeId === change.id) {
            setSelectedNodeId(null);
          }
        }
      });
    },
    [selectedNodeId]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const newEdge: Edge = {
          id: `edge-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          type: 'default',
          markerEnd: { type: MarkerType.Arrow },
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          label: 'asociación'
        };
        setEdges((eds) => [...eds, newEdge]);

        // Crear relación UML correspondiente
        const newRelation: UMLRelation = {
          id: `rel-${Date.now()}`,
          type: 'association',
          source: connection.source,
          target: connection.target,
          label: 'asociación',
          sourceCardinality: '1',
          targetCardinality: '*'
        };
        setRelations(prev => [...prev, newRelation]);
      }
    },
    []
  );

  const onSelectionChange = useCallback(
    ({ nodes }: { nodes: Node[]; edges: Edge[] }) => {
      if (nodes.length > 0) {
        setSelectedNodeId(nodes[0].id);
        // Actualizar estado de selección en los nodos
        setNodes(prevNodes => 
          prevNodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              isSelected: node.id === nodes[0].id
            },
            selected: node.id === nodes[0].id
          }))
        );
      } else {
        setSelectedNodeId(null);
        setNodes(prevNodes => 
          prevNodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              isSelected: false
            },
            selected: false
          }))
        );
      }
    },
    []
  );

  const selectedClass = selectedNodeId ? classes.find(c => c.id === selectedNodeId) : null;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9fafb' }}>
      {/* Panel de instrucciones */}
      <div style={{
        width: 300,
        background: 'white',
        padding: '20px',
        borderRight: '2px solid #e5e7eb',
        overflowY: 'auto'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: '20px' }}>
          🎯 Demo: Resize & Conexiones
        </h2>
        
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#374151', fontSize: '16px', marginBottom: '10px' }}>
            ✨ Funcionalidades Implementadas:
          </h3>
          
          <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#6b7280' }}>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#2563eb' }}>🔧 Redimensionar:</strong>
              <br />• Selecciona un nodo (clic izquierdo)
              <br />• Arrastra las esquinas azules para redimensionar
              <br />• Mantén proporciones o cambia libremente
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#059669' }}>🔗 Conectar Clases:</strong>
              <br />• Clic derecho en un nodo
              <br />• Aparecen puntos azules de conexión
              <br />• Arrastra desde un punto hacia otro nodo
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#7c3aed' }}>🎯 Selección:</strong>
              <br />• Clic izquierdo para seleccionar
              <br />• Clic en espacio vacío para deseleccionar
              <br />• Los handles aparecen solo al hacer clic derecho
            </div>
          </div>
        </div>

        {selectedClass && (
          <div style={{
            background: '#f3f4f6',
            padding: '15px',
            borderRadius: '8px',
            border: '2px solid #3b82f6'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>
              📊 Clase Seleccionada
            </h4>
            <div style={{ fontSize: '13px', color: '#374151' }}>
              <div><strong>Nombre:</strong> {selectedClass.name}</div>
              <div><strong>Ancho:</strong> {selectedClass.dimensions?.width || 'No definido'}</div>
              <div><strong>Alto:</strong> {selectedClass.dimensions?.height || 'No definido'}</div>
              <div><strong>Posición:</strong> ({selectedClass.position.x}, {selectedClass.position.y})</div>
              <div><strong>Atributos:</strong> {selectedClass.attributes.length}</div>
              <div><strong>Métodos:</strong> {selectedClass.methods.length}</div>
            </div>
          </div>
        )}
        
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#9ca3af' }}>
          <div><strong>Conexiones creadas:</strong> {edges.length}</div>
          <div><strong>Relaciones UML:</strong> {relations.length}</div>
        </div>
      </div>

      {/* Área del diagrama */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          snapToGrid={true}
          snapGrid={[10, 10]}
          fitView
          style={{ background: '#f9fafb' }}
        >
          <Controls />
          <Background color="#e5e7eb" gap={20} />
        </ReactFlow>
        
        {/* Indicador de estado */}
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: selectedNodeId ? '#3b82f6' : '#6b7280',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {selectedNodeId ? `Seleccionado: ${selectedClass?.name}` : 'Ningún nodo seleccionado'}
        </div>
      </div>
    </div>
  );
};
