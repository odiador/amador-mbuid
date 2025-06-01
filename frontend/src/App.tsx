import { useState } from 'react';
import ErrorMessage from './components/ErrorMessage';
import JsonEditor from './components/JsonEditor';
import LoadingSpinner from './components/LoadingSpinner';
import UIPreview from './components/UIPreview';
import { useUIGenerator } from './hooks/useUIGenerator';
import { ModeloFormulario } from './types';

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

function App() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(ejemploModelo, null, 2));
  const [isValidJson, setIsValidJson] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState({});

  const { uiResponse, loading, error, generarUI, clearError } = useUIGenerator();

  const handleJsonValidation = (isValid: boolean, errorMessage?: string) => {
    setIsValidJson(isValid);
    setValidationError(errorMessage || null);
  };

  const handleGenerarUI = async () => {
    if (!isValidJson) {
      return;
    }

    try {
      const modelo: ModeloFormulario = JSON.parse(jsonInput);
      await generarUI(modelo);
      setPreviewData({}); // Reset preview data
    } catch (err) {
      console.error('Error al parsear JSON:', err);
    }
  };

  const resetExample = () => {
    setJsonInput(JSON.stringify(ejemploModelo, null, 2));
    setPreviewData({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AMABUID</h1>
              <p className="text-sm text-gray-600 mt-1">
                Model-Based User Interface Development
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={resetExample}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                Restaurar ejemplo
              </button>
              <button
                onClick={handleGenerarUI}
                disabled={loading || !isValidJson}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generando...' : 'Generar interfaz'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - JSON Editor */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Editor de modelo JSON
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Define la estructura de tu formulario usando JSON. El modelo debe incluir un título y una lista de campos.
              </p>
            </div>

            {/* Validation Error */}
            {validationError && (
              <ErrorMessage
                message={`JSON inválido: ${validationError}`}
                type="error"
              />
            )}

            {/* API Error */}
            {error && (
              <ErrorMessage
                message={error}
                type="error"
                onDismiss={clearError}
              />
            )}

            {/* JSON Editor */}
            <JsonEditor
              value={jsonInput}
              onChange={setJsonInput}
              onValidation={handleJsonValidation}
              height={500}
            />

            {/* JSON Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isValidJson ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className={`text-sm ${isValidJson ? 'text-green-700' : 'text-red-700'}`}>
                {isValidJson ? 'JSON válido' : 'JSON inválido'}
              </span>
            </div>
          </div>

          {/* Right Panel - UI Preview */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Vista previa de la interfaz
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Aquí se mostrará la interfaz de usuario generada a partir de tu modelo JSON.
              </p>
            </div>

            {loading && (
              <LoadingSpinner 
                size="lg" 
                message="Generando interfaz de usuario..." 
              />
            )}

            {uiResponse && !loading && (
              <UIPreview
                jsonSchema={uiResponse.jsonSchema}
                uiSchema={uiResponse.uiSchema}
                data={previewData}
                onDataChange={setPreviewData}
              />
            )}

            {!uiResponse && !loading && (
              <div className="flex items-center justify-center h-64 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <div className="text-gray-400 text-4xl mb-4">📝</div>
                  <p className="text-gray-500">
                    Haz clic en "Generar interfaz" para ver la vista previa
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generated Data Preview */}
        {Object.keys(previewData).length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Datos del formulario
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <pre className="text-sm text-gray-800 overflow-auto">
                {JSON.stringify(previewData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              AMABUID - Desarrollado con ❤️ usando React, Cloudflare Workers y JSONForms
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
