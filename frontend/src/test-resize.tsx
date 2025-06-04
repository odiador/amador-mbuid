import React, { useState, useCallback } from 'react';
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
import { NodeResizer } from '@reactflow/node-resizer';
import 'reactflow/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';

const ResizableNode = ({ data, selected }: any) => {
  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
      />
      <div style={{
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        width: '100%',
        height: '100%'
      }}>
        {data.label}
      </div>
    </>
  );
};

const nodeTypes = {
  resizable: ResizableNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'resizable',
    position: { x: 100, y: 100 },
    data: { label: 'Resizable Node' },
    style: { width: 200, height: 100 },
  },
];

export const TestResize = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      console.log('Node changes:', changes);
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => [...eds, connection as Edge]),
    []
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};
