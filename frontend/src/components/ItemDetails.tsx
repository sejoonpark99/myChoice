import React from 'react';
import { Calendar, Tag, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Item } from '../utils/interface/interfaces';

interface ItemDetailsProps {
  item: Item;
  onDelete: (id: number) => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete(item.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h1 className="page-heading text-3xl font-bold text-gray-900 mb-4">{item.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Tag className="w-5 h-5 text-gray-400 mr-2" />
              <span className={`nav-heading inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                item.group === 'Primary' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {item.group}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link 
            to={`/items/${item.id}/edit`}
            className="nav-link flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          
          <button 
            onClick={handleDelete}
            className="nav-link flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="nav-heading text-sm font-medium text-gray-500 mb-2">Created</h3>
            <div className="flex items-center text-gray-900">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="nav-heading">{formatDate(item.created_at)}</span>
            </div>
          </div>
          
          <div>
            <h3 className="nav-heading text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
            <div className="flex items-center text-gray-900">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="nav-heading">{formatDate(item.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;