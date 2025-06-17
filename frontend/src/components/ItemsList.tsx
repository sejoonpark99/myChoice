import React from 'react';
import ItemCard from './ItemCard';
import { Item  } from '../utils/interface/interfaces';

interface ItemsListProps {
  items: Item[];
  onDelete: (id: number) => void;
  selectedItems?: number[];
  onSelectItem?: (id: number, selected: boolean) => void;
  showCheckboxes?: boolean;
}

const ItemsList: React.FC<ItemsListProps> = ({ 
  items, 
  onDelete, 
  selectedItems = [], 
  onSelectItem, 
  showCheckboxes = false 
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-6v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V7a1 1 0 011-1h4a1 1 0 011 1z" />
          </svg>
        </div>
        <h3 className="content-heading text-lg font-medium text-gray-900 mb-2">No items found</h3>
        <p className="nav-heading text-gray-500">Get started by creating your first item.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard 
          key={item.id} 
          item={item} 
          onDelete={onDelete}
          isSelected={selectedItems.includes(item.id)}
          onSelect={onSelectItem}
          showCheckbox={showCheckboxes}
        />
      ))}
    </div>
  );
};

export default ItemsList;