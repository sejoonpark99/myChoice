import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { Item } from '../utils/interface/interfaces';

interface ItemCardProps {
  item: Item;
  onDelete: (id: number) => void;
  isSelected?: boolean;
  onSelect?: (id: number, selected: boolean) => void;
  showCheckbox?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onDelete, 
  isSelected = false, 
  onSelect, 
  showCheckbox = false 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete(item.id);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(item.id, e.target.checked);
    }
  };

  return (
    <div className={`group bg-white rounded-lg shadow-sm border transition-all duration-300 transform hover:-translate-y-1 ${
      isSelected ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:shadow-md'
    }`}>
      <div className="p-6">
        {showCheckbox && (
          <div className="flex items-center justify-end mb-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
            />
          </div>
        )}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="content-heading text-lg font-semibold text-gray-900 mb-2 relative">
              <span className="relative">
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </h3>
            <span className={`nav-heading inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium transition-all duration-300 ${
              item.group === 'Primary' 
                ? 'bg-gray-900 text-white group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-orange-600' 
                : 'bg-gray-200 text-gray-800 group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-orange-600 group-hover:text-white'
            }`}>
              {item.group}
            </span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="w-4 h-4 mr-1" />
          <span className="nav-heading">Created {formatDate(item.created_at)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <Link 
            to={`/items/${item.id}`}
            className="nav-link flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">View</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link 
              to={`/items/${item.id}/edit`}
              className="nav-link flex items-center space-x-1 text-black transition-colors duration-200 relative group/edit"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm relative">
                Edit
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover/edit:w-full"></span>
              </span>
            </Link>
            
            <button 
              onClick={handleDelete}
              className="nav-link flex items-center space-x-1 text-black transition-colors duration-200 relative group/delete"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm relative">
                Delete
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover/delete:w-full"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;