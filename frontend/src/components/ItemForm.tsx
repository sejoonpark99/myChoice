import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { ItemFormData, ValidationErrors } from '../utils/interface/interfaces';

interface ItemFormProps {
  initialData?: ItemFormData;
  onSubmit: (data: ItemFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  serverError?: string | null;
}

const ItemForm: React.FC<ItemFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  submitLabel = 'Save Item',
  serverError = null
}) => {
  const [formData, setFormData] = useState<ItemFormData>({
    name: initialData?.name || '',
    group: initialData?.group || 'Primary'
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  const [isValid, setIsValid] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Check if server error is a duplicate error
  const isDuplicateError = serverError && (
    serverError.toLowerCase().includes('unique set') ||
    serverError.toLowerCase().includes('already exists') || 
    serverError.toLowerCase().includes('duplicate') || 
    serverError.toLowerCase().includes('unique constraint') ||
    serverError.toLowerCase().includes('must make a unique set')
  );

  // Show modal when duplicate error occurs
  useEffect(() => {
    console.log('Server error:', serverError);
    console.log('Is duplicate error:', isDuplicateError); 
    if (isDuplicateError) {
      setShowDuplicateModal(true);
    }
  }, [isDuplicateError, serverError]);

  // Real-time validation
  useEffect(() => {
    const newErrors = validateField();
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  const validateField = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    
    // Name validation
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Name is required';
    } else if (trimmedName.length > 100) {
      newErrors.name = 'Name must be 100 characters or less';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Group validation
    if (!formData.group) {
      newErrors.group = 'Group is required';
    } else if (!['Primary', 'Secondary'].includes(formData.group)) {
      newErrors.group = 'Group must be either Primary or Secondary';
    }
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ name: true, group: true });
    
    const validationErrors = validateField();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      // Trim whitespace before submitting
      const cleanedData = {
        ...formData,
        name: formData.name.trim()
      };
      onSubmit(cleanedData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const getFieldError = (fieldName: keyof ValidationErrors) => {
    return touched[fieldName] ? errors[fieldName] : undefined;
  };

  const characterCount = formData.name.length;
  const isNameTooLong = characterCount > 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="nav-heading block text-sm font-medium text-gray-700 mb-2">
            Item Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              className={`nav-heading w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 ${
                getFieldError('name')
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
              }`}
              placeholder="Enter item name"
              disabled={isLoading}
              maxLength={101} // Allow one extra char to show validation error
            />
            {getFieldError('name') && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          
          {/* Character counter */}
          <div className="flex justify-between items-center mt-1">
            <div>
              {getFieldError('name') && (
                <p className="nav-heading text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getFieldError('name')}
                </p>
              )}
            </div>
            <div className={`nav-heading text-xs ${isNameTooLong ? 'text-red-500' : 'text-gray-500'}`}>
              {characterCount}/100
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="group" className="nav-heading block text-sm font-medium text-gray-700 mb-2">
            Group <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="group"
              name="group"
              value={formData.group}
              onChange={handleChange}
              onBlur={() => handleBlur('group')}
              className={`nav-heading w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 ${
                getFieldError('group')
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
              }`}
              disabled={isLoading}
            >
              <option value="">Select a group</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
            </select>
            {getFieldError('group') && (
              <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {getFieldError('group') && (
            <p className="nav-heading mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getFieldError('group')}
            </p>
          )}
        </div>

        {/* Form validation summary */}
        {Object.keys(errors).length > 0 && (touched.name || touched.group) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="nav-heading text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h3>
                <ul className="nav-heading mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="nav-heading flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          
          <button
            type="submit"
            className={`nav-heading flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
              isValid && !isLoading
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={!isValid || isLoading}
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : submitLabel}</span>
          </button>
        </div>
      </form>

      <Modal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        title="Duplicate Item Name"
        type="error"
      >
        <div className="space-y-4">
          <p className="nav-heading text-gray-700">
            An item named <strong>"{formData.name.trim()}"</strong> already exists in the <strong>{formData.group}</strong> group.
          </p>
          <p className="nav-heading text-sm text-gray-600">
            Each group can only contain items with unique names. Please choose a different name or select a different group.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ItemForm;