import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Components
import ItemForm from '../components/ItemForm';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

// Utils
import { logToServer } from '../utils/logger';
import { ItemFormData, Item, EditItemPageState } from '../utils/interface/interfaces';

/**
 * EditItemPage Component
 * 
 * Renders a page for editing existing items with form validation,
 * error handling, data fetching, and navigation functionality.
 */
const EditItemPage: React.FC = () => {
  // Hooks
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State management
  const [state, setState] = useState<EditItemPageState>({
    item: null,
    loading: true,
    saving: false,
    error: null,
  });

  // Configuration
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Effects
  useEffect(() => {
    if (id) {
      const itemId = parseInt(id, 10);
      if (!isNaN(itemId)) {
        fetchItem(itemId);
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Invalid item ID',
        }));
      }
    }
  }, [id]);

  /**
   * Fetches item details from the API
   * 
   * @param itemId - The ID of the item to fetch
   */
  const fetchItem = async (itemId: number): Promise<void> => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));

      const response = await fetch(`${API_BASE_URL}/collections/${itemId}/`);
      
      if (!response.ok) {
        const errorMessage = response.status === 404 
          ? 'Item not found' 
          : 'Failed to fetch item';
        
        setState(prev => ({ 
          ...prev, 
          error: errorMessage,
          loading: false 
        }));
        return;
      }
      
      const itemData = await response.json();
      
      setState(prev => ({ 
        ...prev, 
        item: itemData, 
        error: null,
        loading: false 
      }));

      // Log successful fetch
      await logToServer('INFO', `Fetched item ${itemId} for edit`, { 
        itemId 
      });

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch item';
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));

      await logToServer('ERROR', 'Failed to fetch item for edit', { 
        itemId, 
        error: errorMessage 
      });
    }
  };

  /**
   * Handles form submission for updating an item
   * 
   * @param formData - The updated item data from the form
   */
  const handleSubmit = async (formData: ItemFormData): Promise<void> => {
    if (!state.item) return;

    try {
      setState(prev => ({ 
        ...prev, 
        saving: true, 
        error: null 
      }));

      const response = await fetch(`${API_BASE_URL}/collections/${state.item.id}/`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = extractErrorMessage(errorData);
        throw new Error(errorMessage);
      }

      // Log successful update
      try {
        await logToServer('INFO', `Successfully updated item ${state.item.id}`, { 
          itemId: state.item.id, 
          formData 
        });
      } catch (logError) {
        // Log error but don't prevent navigation since update succeeded
        console.error('Logging error (but update succeeded):', logError);
      }
      
      // Navigate to item detail page on success
      navigate(`/items/${state.item.id}`);

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update item';
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }));

      await logToServer('ERROR', 'Failed to update item', { 
        itemId: state.item.id,
        error: errorMessage,
        formData 
      });

    } finally {
      setState(prev => ({ 
        ...prev, 
        saving: false 
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
    return 'Failed to update item';
  };

  /**
   * Handles cancel action - navigates back to item detail page
   */
  const handleCancel = (): void => {
    if (id) {
      navigate(`/items/${id}`);
    } else {
      navigate('/items');
    }
  };

  /**
   * Handles navigation back to items list
   */
  const handleBackToItems = (): void => {
    navigate('/items');
  };

  /**
   * Handles navigation back to item detail page
   */
  const handleBackToItem = (): void => {
    if (state.item) {
      navigate(`/items/${state.item.id}`);
    } else {
      navigate('/items');
    }
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

  // Render loading state
  if (state.loading) {
    return <Loader />;
  }

  // Render error state when no item is found
  if (state.error && !state.item) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToItems}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            aria-label="Go back to items list"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Items</span>
          </button>
        </div>
        
        {/* Error Alert */}
        <Alert 
          type="error" 
          message={state.error} 
        />
      </div>
    );
  }

  // Render not found state
  if (!state.item) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToItems}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            aria-label="Go back to items list"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Items</span>
          </button>
        </div>
        
        {/* Not Found Alert */}
        <Alert 
          type="error" 
          message="Item not found" 
        />
      </div>
    );
  }

  // Render main edit form
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBackToItem}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          aria-label="Go back to item details"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Item</span>
        </button>
      </div>

      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Item
        </h1>
        <p className="text-gray-600 mt-1">
          Update the details for "{state.item.name}"
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

      {/* Item Edit Form */}
      <ItemForm
        initialData={{
          name: state.item.name,
          group: state.item.group
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={state.saving}
        submitLabel="Update Item"
        serverError={state.error}
      />
    </div>
  );
};

export default EditItemPage;