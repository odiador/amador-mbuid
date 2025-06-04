import { UMLClass } from '../types/uml';

export interface CodeFile {
  path: string;
  content: string;
}

export interface CodeGenerator {
  name: string;
  description: string;
  generate(classes: UMLClass[]): Promise<CodeFile[]>;
}

export interface GeneratedProject {
  name: string;
  files: CodeFile[];
}
