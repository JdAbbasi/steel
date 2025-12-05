import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Database } from 'lucide-react';
import { ManualEntry, MetalType } from '../types';
import Tooltip from './Tooltip';

interface ManualEntryManagerProps {
  entries: ManualEntry[];
  onAdd: (entry: ManualEntry) => void;
  onUpdate: (entry: ManualEntry) => void;
  onDelete: (id: string) => void;
}

const ManualEntryManager: React.FC<ManualEntryManagerProps> = ({ entries, onAdd, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ManualEntry>>({
    code: '',
    description: '',
    category: '',
    metalType: MetalType.ALUMINUM
  });

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      category: '',
      metalType: MetalType.ALUMINUM
    });
    setIsEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.description) return;

    if (isEditing) {
      onUpdate({ ...formData, id: isEditing } as ManualEntry);
    } else {
      onAdd({
        ...formData,
        id: crypto.randomUUID(),
      } as ManualEntry);
    }
    resetForm();
  };

  const handleEdit = (entry: ManualEntry) => {
    setIsEditing(entry.id);
    setFormData(entry);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Manual Derivative Entries</h3>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">HTS Code / Range</label>
            <input
              type="text"
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value})}
              placeholder="e.g. 7604.10 or 7306"
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category Name</label>
            <input
              type="text"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              placeholder="e.g. Aluminum Wire"
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description / Rule</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Matching criteria details..."
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Metal Type</label>
            <select
              value={formData.metalType}
              onChange={e => setFormData({...formData, metalType: e.target.value as MetalType})}
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value={MetalType.ALUMINUM}>Aluminum</option>
              <option value={MetalType.STEEL}>Steel</option>
              <option value={MetalType.BOTH}>Both</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 rounded transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded transition-colors"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isEditing ? 'Update Entry' : 'Add Entry'}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">HTS Code</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Metal</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">{entry.code}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{entry.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      entry.metalType === MetalType.ALUMINUM ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      entry.metalType === MetalType.STEEL ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}>
                      {entry.metalType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={entry.description}>
                    {entry.description}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip content="Edit Entry">
                        <button onClick={() => handleEdit(entry)} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete Entry">
                        <button onClick={() => onDelete(entry.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400 italic">
                  No manual entries found. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManualEntryManager;