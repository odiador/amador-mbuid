import React from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JSONSchema, UISchema } from '../types';

interface UIPreviewProps {
  jsonSchema: JSONSchema;
  uiSchema: UISchema;
  data?: any;
  onDataChange?: (data: any) => void;
}

const UIPreview: React.FC<UIPreviewProps> = ({
  jsonSchema,
  uiSchema,
  data = {},
  onDataChange,
}) => {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Vista previa de la interfaz
        </h3>
        <p className="text-sm text-gray-600">
          Esta es la interfaz generada a partir de tu modelo JSON
        </p>
      </div>
      
      <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
        <JsonForms
          schema={jsonSchema}
          uischema={uiSchema}
          data={data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data: newData }) => onDataChange?.(newData)}
        />
      </div>
    </div>
  );
};

export default UIPreview;
