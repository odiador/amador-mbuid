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
} from 'reactflow';
import 'reactflow/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';
import ResizableUMLNode from './components/ResizableUMLNode';
import { UMLClass } from './types/uml';
import { createUMLAttribute, createUMLMethod } from './utils/umlHelpers';

const nodeTypes = {
  umlClass: ResizableUMLNode,
};

const testClasses: UMLClass[] = [
  {
    id: '1',
    name: 'TestClass1',
    attributes: [
      createUMLAttribute('id', 'string'),
      createUMLAttribute('name', 'string'),
    ],
    methods: [
      createUMLMethod('getId', 'string'),
      createUMLMethod('getName', 'string'),
    ],
    position: { x: 100, y: 100 },
    dimensions: { width: 200, height: 150 }
  },
  {
    id: '2',
    name: 'TestClass2',
    attributes: [
      createUMLAttribute('value', 'number'),
      createUMLAttribute('active', 'boolean'),
    ],
    methods: [
      createUMLMethod('getValue', 'number'),
      createUMLMethod('isActive', 'boolean'),
    ],
    position: { x: 400, y: 100 },
    dimensions: { width: 220, height: 170 }
  }
];

const initialNodes: Node[] = testClasses.map((umlClass) => ({
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

export const TestResizeConnections = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      console.log('Node changes:', changes);
      setNodes((nds) => applyNodeChanges(changes, nds));
      
      // Actualizar selección
      changes.forEach(change => {
        if (change.type === 'select') {
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
      console.log('Edge changes:', changes);
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      console.log('New connection:', connection);
      if (connection.source && connection.target) {
        const newEdge: Edge = {
          id: `edge-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          type: 'default',
          style: { stroke: '#3b82f6', strokeWidth: 2 }
        };
        setEdges((eds) => [...eds, newEdge]);
      }
    },
    []
  );

  const onSelectionChange = useCallback(
    ({ nodes }: { nodes: Node[]; edges: Edge[] }) => {
      if (nodes.length > 0) {
        setSelectedNodeId(nodes[0].id);
        // Actualizar el estado de selección en los nodos
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

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000,
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Test: Resize & Conexiones</h3>
        <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
          <div>• <strong>Resize:</strong> Selecciona un nodo y arrastra las esquinas</div>
          <div>• <strong>Conexiones:</strong> Clic derecho en un nodo → arrastra desde punto azul</div>
          <div>• <strong>Selección:</strong> Clic izquierdo para seleccionar</div>
        </div>
      </div>
      
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
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};
