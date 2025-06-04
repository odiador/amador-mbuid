export interface UMLClass {
  id: string;
  name: string;
  attributes: string[];
  methods: string[];
  position: { x: number; y: number };
}

export interface UMLRelation {
  id: string;
  source: string;
  target: string;
  type: 'association' | 'inheritance' | 'aggregation' | 'composition' | 'dependency';
  label?: string;
  sourceCardinality?: string; // ej: "1", "0..1", "1..*", "*"
  targetCardinality?: string;
}

export interface UMLModel {
  classes: UMLClass[];
  relations: UMLRelation[];
}
