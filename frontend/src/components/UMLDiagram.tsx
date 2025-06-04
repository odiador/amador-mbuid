import React, { useCallback, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge, 
  Connection, 
  NodeChange, 
  EdgeChange, 
  MarkerType 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { UMLClass, UMLRelation, UMLModel } from '../types/uml';
import { CodeGenerator } from './CodeGenerator';
import { RelationshipPanel } from './RelationshipPanel';

// Función para crear el contenido visual de una clase UML
const formatClassContent = (umlClass: UMLClass) => {
  let content = umlClass.name;
  if (umlClass.attributes.length > 0) {
    content += '\n---\n' + umlClass.attributes.join('\n');
  }
  if (umlClass.methods.length > 0) {
    content += '\n---\n' + umlClass.methods.join('\n');
  }
  return content;
};

// Función para convertir UMLRelation a React Flow Edge con estilos específicos
const relationToEdge = (relation: UMLRelation): Edge => {
  const baseEdge: Edge = {
    id: relation.id,
    source: relation.source,
    target: relation.target,
    label: relation.label || '',
    type: 'default'
  };

  // Configurar estilos según el tipo de relación UML
  switch (relation.type) {
    case 'inheritance':
      return {
        ...baseEdge,
        markerEnd: { type: MarkerType.Arrow, width: 20, height: 20 },
        style: { stroke: '#2563eb', strokeWidth: 2 },
        labelStyle: { fontSize: 12, fontWeight: 'bold' },
        data: { 
          relation,
          sourceCardinality: relation.sourceCardinality,
          targetCardinality: relation.targetCardinality
        }
      };
    
    case 'composition':
      return {
        ...baseEdge,
        markerEnd: { type: MarkerType.Arrow, width: 15, height: 15 },
        style: { stroke: '#7c2d12', strokeWidth: 2 },
        labelStyle: { fontSize: 12 },
        data: {
          relation,
          sourceCardinality: relation.sourceCardinality,
          targetCardinality: relation.targetCardinality
        }
      };
    
    case 'aggregation':
      return {
        ...baseEdge,
        markerEnd: { type: MarkerType.Arrow, width: 15, height: 15 },
        style: { stroke: '#059669', strokeWidth: 2 },
        labelStyle: { fontSize: 12 },
        data: { 
          relation,
          sourceCardinality: relation.sourceCardinality,
          targetCardinality: relation.targetCardinality
        }
      };
    
    case 'dependency':
      return {
        ...baseEdge,
        markerEnd: { type: MarkerType.Arrow, width: 12, height: 12 },
        style: { stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '5,5' },
        labelStyle: { fontSize: 11, fontStyle: 'italic' },
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
        markerEnd: { type: MarkerType.Arrow, width: 12, height: 12 },
        style: { stroke: '#374151', strokeWidth: 1.5 },
        labelStyle: { fontSize: 12 },
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
    attributes: ['name: string', 'age: number', 'email: string'],
    methods: ['getName(): string', 'setAge(age: number): void', 'getEmail(): string'],
    position: { x: 250, y: 150 }
  },
  {
    id: '2',
    name: 'Student',
    attributes: ['studentId: string', 'grade: float', 'isActive: boolean'],
    methods: ['getStudentId(): string', 'setGrade(grade: float): void', 'isEnrolled(): boolean'],
    position: { x: 550, y: 150 }
  },
  {
    id: '3',
    name: 'Course',
    attributes: ['code: string', 'title: string', 'credits: int', 'startDate: Date'],
    methods: ['getCode(): string', 'getCredits(): int', 'getDuration(): int'],
    position: { x: 400, y: 350 }
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
  const [newAttribute, setNewAttribute] = useState('');
  const [newMethod, setNewMethod] = useState('');

  // Tipos primitivos comunes para sugerencias
  const primitiveTypes = ['string', 'int', 'float', 'double', 'boolean', 'Date', 'char', 'byte', 'long'];

  // Convertir clases a nodos con posiciones sincronizadas
  const nodes: Node[] = classes.map((umlClass) => ({
    id: umlClass.id,
    type: 'default',
    position: umlClass.position,
    data: { label: formatClassContent(umlClass) },
    style: {
      background: '#fff',
      border: '2px solid #e5e7eb',
      borderRadius: 8,
      padding: 20,
      fontSize: 14,
      fontFamily: 'monospace',
      whiteSpace: 'pre-line',
      textAlign: 'left',
      minWidth: 200,
      color: '#374151'
    },
    draggable: true
  }));

  // Convertir relaciones a edges con estilos
  const edges: Edge[] = relations.map(relationToEdge);

  // Obtener la clase seleccionada
  const selectedClass = selectedNodeId ? classes.find(c => c.id === selectedNodeId) : null;
  
  // Obtener la relación seleccionada
  const selectedRelation = selectedEdgeId ? relations.find(r => r.id === selectedEdgeId) : null;

  // Manejadores de cambios en nodos y edges
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Sincronizar posiciones con el estado de las clases cuando se mueven
      changes.forEach(change => {
        if (change.type === 'position' && change.position) {
          setClasses(prev => 
            prev.map(cls => 
              cls.id === change.id 
                ? { ...cls, position: change.position! }
                : cls
            )
          );
        }
      });
    },
    []
  );

  const onEdgesChange = useCallback(
    (_changes: EdgeChange[]) => {
      // Manejar cambios en edges si es necesario
    },
    []
  );

  // Manejar conexiones (crear nuevas relaciones)
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const newRelation: UMLRelation = {
          id: `rel_${Date.now()}`,
          type: 'association',
          source: connection.source,
          target: connection.target,
          label: '',
          sourceCardinality: '',
          targetCardinality: ''
        };
        
        setRelations(prev => [...prev, newRelation]);
      }
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
  }, []);

  // Agregar nueva clase
  const addClass = () => {
    const newClass: UMLClass = {
      id: Date.now().toString(),
      name: 'NewClass',
      attributes: ['id: int', 'name: string', 'active: boolean'],
      methods: ['getId(): int', 'setName(name: string): void', 'isActive(): boolean'],
      position: { 
        x: Math.random() * 400 + 200, 
        y: Math.random() * 300 + 100 
      }
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
      setClasses(classes.map(c =>
        c.id === selectedClass.id 
          ? { ...c, attributes: [...c.attributes, newAttribute.trim()] }
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
      setClasses(classes.map(c =>
        c.id === selectedClass.id
          ? { ...c, methods: [...c.methods, newMethod.trim()] }
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
      relations
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
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          style={{ background: '#f9fafb' }}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>

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
                {primitiveTypes.map(type => (
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
                  {attr}
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
                  {method}
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
    </div>
  );
}
