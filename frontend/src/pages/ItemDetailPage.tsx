import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Components
import ItemDetails from '../components/ItemDetails';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

// Utils
import { logToServer } from '../utils/logger';
import { Item, ItemDetailPageState } from '../utils/interface/interfaces';

interface RouteParams extends Record<string, string | undefined> {
  id: string;
}

/**
 * ItemDetailPage Component
 * 
 * Renders a detailed view of a specific item with options to edit or delete.
 * Handles data fetching, error states, and item deletion functionality.
 */
const ItemDetailPage: React.FC = () => {
  // Hooks
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();

  // State management
  const [state, setState] = useState<ItemDetailPageState>({
    item: null,
    loading: true,
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
      await logToServer('INFO', `Loaded detail for item ${itemId}`, { 
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

      await logToServer('ERROR', 'Failed to fetch item', { 
        itemId, 
        error: errorMessage 
      });
    }
  };

  /**
   * Handles item deletion with confirmation and navigation
   * 
   * @param itemId - The ID of the item to delete
   */
  const handleDelete = async (itemId: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/${itemId}/`, {
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Log successful deletion
      await logToServer('WARNING', `Deleted item ${itemId}`, { 
        itemId 
      });
      
      // Navigate back to items list after successful deletion
      navigate('/items');

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete item';
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }));

      await logToServer('ERROR', `Failed to delete item ${itemId}`, { 
        itemId, 
        error: errorMessage 
      });
    }
  };

  /**
   * Handles navigation back to items list
   */
  const handleBackToItems = (): void => {
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

  /**
   * Renders the navigation header with back button
   */
  const renderNavigationHeader = (): React.ReactElement => (
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
  );

  /**
   * Renders the error state layout
   */
  const renderErrorState = (errorMessage: string): React.ReactElement => (
    <div className="max-w-2xl mx-auto space-y-6">
      {renderNavigationHeader()}
      <Alert 
        type="error" 
        message={errorMessage} 
      />
    </div>
  );

  // Render loading state
  if (state.loading) {
    return <Loader />;
  }

  // Render error state when there's an error but no item
  if (state.error && !state.item) {
    return renderErrorState(state.error);
  }

  // Render not found state
  if (!state.item) {
    return renderErrorState('Item not found');
  }

  // Render main item detail view
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Header */}
      {renderNavigationHeader()}

      {/* Error Alert */}
      {state.error && (
        <Alert 
          type="error" 
          message={state.error} 
          onClose={handleErrorDismiss}
        />
      )}

      {/* Item Details Component */}
      <ItemDetails 
        item={state.item} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default ItemDetailPage;