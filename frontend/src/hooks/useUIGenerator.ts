import { useState, useCallback } from 'react';
import { ModeloFormulario, UIResponse } from '../types';
import ApiService from '../services/api';

interface UseUIGeneratorReturn {
  uiResponse: UIResponse | null;
  loading: boolean;
  error: string | null;
  generarUI: (modelo: ModeloFormulario) => Promise<void>;
  clearError: () => void;
  clearResponse: () => void;
}

export function useUIGenerator(): UseUIGeneratorReturn {
  const [uiResponse, setUiResponse] = useState<UIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generarUI = useCallback(async (modelo: ModeloFormulario) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.generarUI(modelo);
      setUiResponse(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setUiResponse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResponse = useCallback(() => {
    setUiResponse(null);
  }, []);

  return {
    uiResponse,
    loading,
    error,
    generarUI,
    clearError,
    clearResponse,
  };
}
