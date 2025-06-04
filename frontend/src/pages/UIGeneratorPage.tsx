import { useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import JsonEditor from '../components/JsonEditor';
import LoadingSpinner from '../components/LoadingSpinner';
import UIPreview from '../components/UIPreview';
import { useUIGenerator } from '../hooks/useUIGenerator';
import { ModeloFormulario } from '../types';

// Ejemplo inicial de modelo
const ejemploModelo: ModeloFormulario = {
  titulo: "Formulario de Contacto",
  descripcion: "Un formulario básico para recopilar información de contacto",
  campos: [
    {
      tipo: "text",
      etiqueta: "Nombre completo",
      requerido: true,
      placeholder: "Ingresa tu nombre completo"
    },
    {
      tipo: "email",
      etiqueta: "Correo electrónico",
      requerido: true,
      placeholder: "tu@email.com"
    },
    {
      tipo: "select",
      etiqueta: "Tipo de consulta",
      requerido: true,
      opciones: ["Soporte técnico", "Ventas", "Información general"]
    },
    {
      tipo: "textarea",
      etiqueta: "Mensaje",
      requerido: false,
      placeholder: "Describe tu consulta..."
    },
    {
      tipo: "checkbox",
      etiqueta: "Acepto los términos y condiciones",
      requerido: true
    }
  ]
};

export default function UIGeneratorPage() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(ejemploModelo, null, 2));
  const [isValidJson, setIsValidJson] = useState(true);
  const [previewData, setPreviewData] = useState({});

  const {
    uiResponse,
    loading,
    error,
    generarUI
  } = useUIGenerator();

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    try {
      JSON.parse(value);
      setIsValidJson(true);
    } catch (err) {
      setIsValidJson(false);
    }
  };

  const handleGenerate = async () => {
    if (!isValidJson) return;
    
    try {
      const modeloJson = JSON.parse(jsonInput);
      await generarUI(modeloJson);
    } catch (err) {
      console.error('Error al generar UI:', err);
    }
  };

  const handlePreviewDataChange = (formData: any) => {
    setPreviewData(formData);
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 80px)',
      background: '#f9fafb' 
    }}>
      {/* Panel izquierdo - Editor JSON */}
      <div style={{ 
        width: '50%', 
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
          background: '#fff'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#374151',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            🎨 Generador de Interfaces
          </h2>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            Define tu modelo JSON y genera una interfaz React automáticamente
          </p>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <JsonEditor
            value={jsonInput}
            onChange={handleJsonChange}
            onValidation={(isValid) => {
              setIsValidJson(isValid);
            }}
          />
          
          <div style={{ 
            padding: '1rem',
            borderTop: '1px solid #e5e7eb',
            background: '#fff'
          }}>
            <button
              onClick={handleGenerate}
              disabled={!isValidJson || loading}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                background: isValidJson && !loading ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isValidJson && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Generando...
                </>
              ) : (
                <>
                  ⚡ Generar UI
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Panel derecho - Vista previa */}
      <div style={{ 
        width: '50%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
          background: '#fff'
        }}>
          <h3 style={{ 
            margin: 0, 
            color: '#374151',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            📱 Vista Previa
          </h3>
        </div>

        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          background: '#fff'
        }}>
          {error && <ErrorMessage message={error} />}
          {uiResponse && (
            <UIPreview 
              jsonSchema={uiResponse.jsonSchema}
              uiSchema={uiResponse.uiSchema}
              data={previewData}
              onDataChange={handlePreviewDataChange}
            />
          )}
          {!uiResponse && !loading && !error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              Genera una interfaz para ver la vista previa
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
