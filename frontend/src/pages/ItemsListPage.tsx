import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';

// Components
import ItemsList from '../components/ItemsList';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

// Utils
import { logToServer } from '../utils/logger';
import { Item, ItemsListPageState, BulkDeleteResponse } from '../utils/interface/interfaces';

// Constants
const GROUP_OPTIONS = [
  { value: 'all', label: 'All Groups' },
  { value: 'Primary', label: 'Primary' },
  { value: 'Secondary', label: 'Secondary' },
] as const;

const INITIAL_STATE: ItemsListPageState = {
  items: [],
  filteredItems: [],
  loading: true,
  error: null,
  searchTerm: '',
  selectedGroup: 'all',
  selectedItems: [],
  isMultiSelectMode: false,
};

/**
 * ItemsListPage Component
 * 
 */
const ItemsListPage: React.FC = () => {
  // State management
  const [state, setState] = useState<ItemsListPageState>(INITIAL_STATE);

  // Configuration
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Effects
  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [state.items, state.searchTerm, state.selectedGroup]);

  /**
   * Fetches all items from the API
   */
  const fetchItems = async (): Promise<void> => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));

      const response = await fetch(`${API_BASE_URL}/collections/`);

      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }

      const itemsData = await response.json();

      setState(prev => ({ 
        ...prev, 
        items: itemsData, 
        error: null,
        loading: false 
      }));

      // Log successful fetch
      await logToServer('INFO', 'Fetched items list', { 
        count: itemsData.length 
      });

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch items';

      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));

      await logToServer('ERROR', 'Error fetching items list', { 
        error: errorMessage 
      });
    }
  };

  /**
   * Handles deletion of a single item
   * 
   * @param itemId - The ID of the item to delete
   */
  const handleSingleDelete = async (itemId: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/collections/${itemId}/`, {
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Remove item from state
      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId),
        selectedItems: prev.selectedItems.filter(id => id !== itemId),
      }));

      // Log successful deletion
      await logToServer('WARNING', `Deleted item ${itemId} from list`, { 
        id: itemId 
      });

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete item';

      setState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }));

      await logToServer('ERROR', `Failed to delete item ${itemId} from list`, { 
        error: errorMessage,
        itemId 
      });
    }
  };

  /**
   * Handles bulk deletion of selected items with user confirmation
   */
  const handleBulkDelete = async (): Promise<void> => {
    if (state.selectedItems.length === 0) return;
    
    const confirmMessage = `Are you sure you want to delete ${state.selectedItems.length} items?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/collections/bulk_delete/`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          ids: state.selectedItems 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete items');
      }
      
      const result: BulkDeleteResponse = await response.json();
      
      // Update state after successful deletion
      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => !prev.selectedItems.includes(item.id)),
        selectedItems: [],
        isMultiSelectMode: false,
      }));
      
      // Log successful bulk deletion
      await logToServer('WARNING', `Bulk deleted ${result.deleted} items`, { 
        deletedIds: state.selectedItems,
        count: result.deleted 
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete items';

      setState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }));

      await logToServer('ERROR', 'Failed to bulk delete items', { 
        error: errorMessage, 
        attemptedIds: state.selectedItems 
      });
    }
  };

  /**
   * Handles item selection in multi-select mode
   * 
   * @param itemId - The ID of the item to select/deselect
   * @param isSelected - Whether the item should be selected
   */
  const handleSelectItem = (itemId: number, isSelected: boolean): void => {
    setState(prev => ({
      ...prev,
      selectedItems: isSelected
        ? [...prev.selectedItems, itemId]
        : prev.selectedItems.filter(id => id !== itemId),
    }));
  };

  /**
   * Handles select all/deselect all functionality
   */
  const handleSelectAll = (): void => {
    setState(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.length === prev.filteredItems.length
        ? [] // Deselect all
        : prev.filteredItems.map(item => item.id), // Select all visible items
    }));
  };

  /**
   * Toggles multi-select mode and clears selections
   */
  const toggleMultiSelectMode = (): void => {
    setState(prev => ({
      ...prev,
      isMultiSelectMode: !prev.isMultiSelectMode,
      selectedItems: [],
    }));
  };

  /**
   * Filters items based on search term and selected group
   */
  const filterItems = (): void => {
    let filtered = state.items;

    // Apply search filter
    if (state.searchTerm.trim()) {
      const searchLower = state.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply group filter
    if (state.selectedGroup !== 'all') {
      filtered = filtered.filter(item => item.group === state.selectedGroup);
    }

    setState(prev => ({ 
      ...prev, 
      filteredItems: filtered 
    }));
  };

  /**
   * Handles search input changes
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState(prev => ({ 
      ...prev, 
      searchTerm: event.target.value 
    }));
  };

  /**
   * Handles group filter changes
   */
  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setState(prev => ({ 
      ...prev, 
      selectedGroup: event.target.value 
    }));
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
   * Renders the page header with title and action buttons
   */
  const renderPageHeader = (): React.ReactElement => (
    <div className="flex items-center justify-between">
      <header>
        <h1 className="page-heading text-3xl font-bold text-gray-900">
          Items
        </h1>
        <p className="nav-heading text-gray-600 mt-1">
          Manage your collection of items
        </p>
      </header>
      
      <div className="flex items-center space-x-3">
        {/* Multi-select toggle button */}
        <button
          onClick={toggleMultiSelectMode}
          className={`nav-link flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
            state.isMultiSelectMode 
              ? 'bg-orange-600 text-white hover:bg-orange-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          aria-label={state.isMultiSelectMode ? 'Exit selection mode' : 'Enter selection mode'}
        >
          <span>{state.isMultiSelectMode ? 'Exit Select' : 'Select Items'}</span>
        </button>
        
        {/* Bulk delete button */}
        {state.isMultiSelectMode && state.selectedItems.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="nav-link flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            aria-label={`Delete ${state.selectedItems.length} selected items`}
          >
            <span>
              Delete {state.selectedItems.length} item{state.selectedItems.length !== 1 ? 's' : ''}
            </span>
          </button>
        )}
        
        {/* New item button */}
        <Link 
          to="/items/new"
          className="nav-link flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
          aria-label="Create new item"
        >
          <Plus className="w-4 h-4" />
          <span>New Item</span>
        </Link>
      </div>
    </div>
  );

  /**
   * Renders the search and filter controls
   */
  const renderSearchAndFilters = (): React.ReactElement => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Search input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search items..."
            value={state.searchTerm}
            onChange={handleSearchChange}
            className="nav-heading w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
            aria-label="Search items"
          />
        </div>
        
        {/* Group filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={state.selectedGroup}
            onChange={handleGroupChange}
            className="nav-heading px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
            aria-label="Filter by group"
          >
            {GROUP_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Multi-select controls */}
      {state.isMultiSelectMode && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleSelectAll}
            className="nav-link text-sm text-orange-600 hover:text-orange-700 transition-colors duration-200"
            aria-label={state.selectedItems.length === state.filteredItems.length ? 'Deselect all items' : 'Select all items'}
          >
            {state.selectedItems.length === state.filteredItems.length ? 'Deselect All' : 'Select All'}
          </button>
          {state.selectedItems.length > 0 && (
            <span className="nav-heading text-sm text-gray-600">
              {state.selectedItems.length} item{state.selectedItems.length !== 1 ? 's' : ''} selected
            </span>
          )}
        </div>
      )}
      
      {/* Items count display */}
      {state.filteredItems.length > 0 && (
        <div className="nav-heading mt-4 text-sm text-gray-600">
          Showing {state.filteredItems.length} of {state.items.length} items
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      {renderPageHeader()}

      {/* Error Alert */}
      {state.error && (
        <Alert 
          type="error" 
          message={state.error} 
          onClose={handleErrorDismiss}
        />
      )}

      {/* Search and Filters */}
      {renderSearchAndFilters()}

      {/* Items List or Loading State */}
      {state.loading ? (
        <Loader />
      ) : (
        <ItemsList 
          items={state.filteredItems} 
          onDelete={handleSingleDelete}
          selectedItems={state.selectedItems}
          onSelectItem={handleSelectItem}
          showCheckboxes={state.isMultiSelectMode}
        />
      )}
    </div>
  );
};

export default ItemsListPage;