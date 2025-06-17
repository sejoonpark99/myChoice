import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Components
import ItemForm from '../components/ItemForm';
import Alert from '../components/Alert';

// Utils
import { logToServer } from '../utils/logger';
import { ItemFormData, CreateItemPageState } from '../utils/interface/interfaces';

/**
 * CreateItemPage Component
 * 
 * Renders a page for creating new items with form validation,
 * error handling, and navigation functionality.
 */
const CreateItemPage: React.FC = () => {
  // Hooks
  const navigate = useNavigate();

  // State management
  const [state, setState] = useState<CreateItemPageState>({
    loading: false,
    error: null,
  });

  // Configuration
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /**
   * Handles form submission for creating a new item
   * 
   * @param formData - The item data from the form
   */
  const handleSubmit = async (formData: ItemFormData): Promise<void> => {
    try {
      // Set loading state
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));

      // Make API request to create item
      const response = await fetch(`${API_BASE_URL}/collections/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData),
      });

      // Handle non-successful responses
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = extractErrorMessage(errorData);
        throw new Error(errorMessage);
      }

      // Log successful creation
      await logToServer('INFO', 'Created item from CreateItemPage', { 
        formData 
      });

      // Navigate to items list on success
      navigate('/items');

    } catch (error) {
      // Handle and log errors
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create item';
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }));

      await logToServer('ERROR', 'Failed to create item', { 
        error: errorMessage,
        formData 
      });

    } finally {
      // Reset loading state
      setState(prev => ({ 
        ...prev, 
        loading: false 
      }));
    }
  };

  /**
   * Extracts error message from API response
   * 
   * @param errorData - Error response from API
   * @returns Formatted error message
   */
  const extractErrorMessage = (errorData: any): string => {
    // Handle Django's non_field_errors format
    if (errorData.non_field_errors?.length > 0) {
      return errorData.non_field_errors[0];
    }
    
    // Handle other common error formats
    if (errorData.detail) {
      return errorData.detail;
    }
    
    if (errorData.message) {
      return errorData.message;
    }
    
    // Default fallback message
    return 'Failed to create item';
  };

  /**
   * Handles cancel action - navigates back to items list
   */
  const handleCancel = (): void => {
    navigate('/items');
  };

  /**
   * Handles navigation back to items list
   */
  const handleBackNavigation = (): void => {
    navigate('/items');
  };

  /**
   * Dismisses the current error message
   */
  const handleErrorDismiss = (): void => {
    setState(prev => ({ 
      ...prev, 
      error: null 
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBackNavigation}
          className="nav-link flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          aria-label="Go back to items list"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Items</span>
        </button>
      </div>

      {/* Page Header */}
      <header>
        <h1 className="page-heading text-3xl font-bold text-gray-900">
          Create New Item
        </h1>
        <p className="nav-heading text-gray-600 mt-1">
          Add a new item to your collection
        </p>
      </header>

      {/* Error Alert */}
      {state.error && (
        <Alert 
          type="error"
          message={state.error}
          onClose={handleErrorDismiss}
        />
      )}

      {/* Item Creation Form */}
      <ItemForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={state.loading}
        submitLabel="Create Item"
        serverError={state.error}
      />
    </div>
  );
};

export default CreateItemPage;