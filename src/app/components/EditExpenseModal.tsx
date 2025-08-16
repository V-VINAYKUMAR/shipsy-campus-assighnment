'use client';
import { useState, useEffect } from 'react';

// Expense type from backend/database
interface Expense {
  description: string;
  category: string;
  reimbursable: boolean;
  amount: number;
  taxRate: number;
}

// Form state type (string versions for inputs)
interface FormState {
  description: string;
  category: string;
  reimbursable: boolean;
  amount: string;
  taxRate: string;
}

interface EditExpenseModalProps {
  expense?: Expense;
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: Omit<Expense, 'id'>) => Promise<void>;
}

export default function EditExpenseModal({
  expense,
  isOpen,
  onClose,
  onSave
}: EditExpenseModalProps) {
  const [form, setForm] = useState<FormState>({
    description: '',
    category: 'TRAVEL' as 'TRAVEL' | 'FOOD' | 'OFFICE' | 'OTHER',
    reimbursable: false,
    amount: '',
    taxRate: '18'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (expense && isOpen) {
      setForm({
        description: expense.description ?? '',
        category: expense.category ?? 'TRAVEL',
        reimbursable: expense.reimbursable ?? false,
        amount: expense.amount?.toString() ?? '',
        taxRate: expense.taxRate?.toString() ?? '18'
      });
    }
  }, [expense, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSave({
        description: form.description,
        category: form.category,
        reimbursable: form.reimbursable,
        amount: parseFloat(form.amount),
        taxRate: parseFloat(form.taxRate)
      });
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Edit Expense</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-200">
              Description
            </label>
            <input
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
              placeholder="Enter expense description..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-200">
              Category
            </label>
            <select
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200 rounded-xl"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="TRAVEL">✈️ Travel</option>
              <option value="FOOD">🍽️ Food</option>
              <option value="OFFICE">🏢 Office</option>
              <option value="OTHER">📦 Other</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-xl">
            <input
              id="reimb"
              type="checkbox"
              className="w-4 h-4 text-emerald-600 bg-gray-600 border-gray-500 rounded focus:ring-emerald-500 focus:ring-2"
              checked={form.reimbursable}
              onChange={(e) =>
                setForm({ ...form, reimbursable: e.target.checked })
              }
            />
            <label
              htmlFor="reimb"
              className="text-sm font-medium text-gray-200"
            >
              Reimbursable
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-200">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const formatted = parseFloat(e.target.value).toFixed(2);
                      setForm({ ...form, amount: formatted });
                    }
                  }}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-200">
                Tax Rate (%)
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  %
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-full pr-8 px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
                  placeholder="18.00"
                  value={form.taxRate}
                  onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const formatted = parseFloat(e.target.value).toFixed(2);
                      setForm({ ...form, taxRate: formatted });
                    }
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Preview Total */}
          {form.amount && form.taxRate && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-gray-400">Total Amount</p>
                <p className="text-xl font-bold text-emerald-400">
                  ₹
                  {(
                    parseFloat(form.amount) +
                    (parseFloat(form.amount) * parseFloat(form.taxRate)) / 100
                  ).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  Base: ₹{parseFloat(form.amount).toFixed(2)} + Tax: ₹
                  {(
                    (parseFloat(form.amount) * parseFloat(form.taxRate)) /
                    100
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 text-gray-200 font-medium rounded-xl hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Expense'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
