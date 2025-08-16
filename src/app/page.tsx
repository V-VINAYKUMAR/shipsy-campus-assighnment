'use client';
import { useEffect, useState, useCallback } from 'react';
import EditExpenseModal from './components/EditExpenseModal';
import { Expense } from '../../src/types/types';


export default function HomePage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expensesList, setExpensesList] = useState({ items: [], total: 0 });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const refreshSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        setSession(data.user);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      setSession(null);
    }
  };

  // Function to refresh expenses data - fetch ALL expenses for dashboard
  const refreshExpenses = async () => {
    try {
      // Fetch all expenses for dashboard calculations (no pagination)
      const res = await fetch('/api/expenses?page=1&pageSize=1000&sort=createdAt:desc');
      if (res.ok) {
        const data = await res.json();
        setExpensesList(data);
      }
    } catch (error) {
      console.error('Failed to refresh expenses:', error);
    }
  };

  useEffect(() => {
    refreshSession().finally(() => setLoading(false));
  }, []);

  // Load expenses on component mount
  useEffect(() => {
    if (session) {
      refreshExpenses();
    }
  }, [session]);

  // Refresh session every 5 minutes to keep it fresh
  useEffect(() => {
    const interval = setInterval(refreshSession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="card p-8 space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8m-5 4v1a3 3 0 01-3 3H6a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Expense Manager</h2>
            <p className="text-gray-400 mb-6">Track and manage your expenses with our powerful dashboard</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login" className="btn btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </a>
            <a href="/register" className="btn btn-secondary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setEditModalOpen(true);
  };

  const handleSaveExpense = async (expenseData: Omit<Expense, "id">) => {
    if (!editingExpense) return;
  
    try {
      const res = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData), // ✅ already numbers
      });
  
      if (res.ok) {
        setEditModalOpen(false);
        setEditingExpense(null);
        await refreshExpenses();
      } else {
        throw new Error('Failed to update expense');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense. Please try again.');
    }
  };
  

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Expense Dashboard</h2>
          <p className="text-gray-400">Welcome back, {session?.username || 'User'}! Manage your expenses below.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-400">Total Expenses</p>
            <p className="text-xl sm:text-2xl font-bold text-green-400">
              ₹{expensesList?.total > 0 ? expensesList.items.reduce((sum, expense) => sum + expense.grandTotal, 0).toFixed(2) : '0.00'}
            </p>
          </div>
          <button 
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="btn btn-secondary text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {expensesList?.total > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="card p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-200">Total Expenses</h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-400">
              ₹{expensesList.items.reduce((sum, expense) => sum + expense.grandTotal, 0).toFixed(2)}
            </p>
          </div>
          
          <div className="card p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-200">Reimbursable</h3>
            <p className="text-xl sm:text-2xl font-bold text-green-400">
              ₹{expensesList.items.filter(e => e.reimbursable).reduce((sum, expense) => sum + expense.grandTotal, 0).toFixed(2)}
            </p>
          </div>
          
          <div className="card p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-200">Categories</h3>
            <p className="text-xl sm:text-2xl font-bold text-purple-400">
              {new Set(expensesList.items.map(e => e.category)).size}
            </p>
          </div>
          
          <div className="card p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-200">This Month</h3>
            <p className="text-xl sm:text-2xl font-bold text-orange-400">
              ₹{expensesList.items.filter(e => {
                const expenseDate = new Date(e.createdAt);
                const now = new Date();
                return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
              }).reduce((sum, expense) => sum + expense.grandTotal, 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}
      
      <ExpensePanel 
        onExpensesUpdate={setExpensesList} 
        onEditExpense={handleEditExpense}
        onRefresh={refreshExpenses}
      />

      {/* Edit Expense Modal */}
      <EditExpenseModal
        expense={editingExpense}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
      />
    </div>
  );
}

function ExpensePanel({ onExpensesUpdate, onEditExpense, onRefresh }) {
  const [form, setForm] = useState({ 
    description: '', 
    category: 'TRAVEL', 
    reimbursable: false, 
    amount: '', 
    taxRate: '18' 
  });
  const [list, setList] = useState({ items: [], total: 0 });
  const [params, setParams] = useState({ 
    page: 1, 
    pageSize: 10, 
    category: '', 
    reimbursable: '', 
    sort: 'createdAt:desc', 
    search: '' 
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const query = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
      sort: params.sort,
      ...(params.category ? { category: params.category } : {}),
      ...(params.reimbursable ? { reimbursable: params.reimbursable } : {}),
      ...(params.search ? { search: params.search } : {}),
    }).toString();
    const res = await fetch('/api/expenses?' + query);
    const data = await res.json();
    setList(data);
    onExpensesUpdate(data); // Update parent component
    setLoading(false);
  }, [params.page, params.pageSize, params.category, params.reimbursable, params.sort, params.search, onExpensesUpdate]);

  useEffect(() => { 
    load(); 
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Enhanced validation with better error messages
    const errors = [];
    
    if (!form.description.trim()) {
      errors.push('Please enter a description');
    }
    
    if (!form.amount || parseFloat(form.amount) <= 0) {
      errors.push('Please enter a valid amount greater than 0');
    }
    
    if (!form.taxRate || parseFloat(form.taxRate) < 0 || parseFloat(form.taxRate) > 100) {
      errors.push('Please enter a valid tax rate between 0 and 100');
    }
    
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      setSubmitting(false);
      return;
    }
    
    const expenseData = {
      description: form.description.trim(),
      category: form.category,
      reimbursable: form.reimbursable,
      amount: parseFloat(form.amount),
      taxRate: parseFloat(form.taxRate),
    };
    
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });
      
      if (res.ok) {
        setForm({ description: '', category: 'TRAVEL', reimbursable: false, amount: '', taxRate: '18' });
        
        // Refresh both local and parent data
        await load();
        
        // Also trigger parent refresh for dashboard tiles
        if (onRefresh) {
          await onRefresh();
        }
        
        // Show success message
        console.log('Expense added successfully!');
      } else {
        const errorText = await res.text();
        alert(`Failed to save expense: ${errorText}`);
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Network error. Please try again.');
    }
    
    setSubmitting(false);
  };

  const deleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    const res = await fetch('/api/expenses/' + id, { method: 'DELETE' });
    if (res.ok) {
      // Refresh both local and parent data
      await load();
      
      // Also trigger parent refresh for dashboard tiles
      if (onRefresh) {
        await onRefresh();
      }
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      TRAVEL: '✈️',
      FOOD: '🍽️',
      OFFICE: '🏢',
      OTHER: '📦'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
      {/* Add Expense Form */}
      <div className="lg:col-span-1">
        <div className="card p-4 sm:p-6 space-y-6 sticky top-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Add Expense</h3>
              <p className="text-sm text-gray-400">Create a new expense entry</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => setForm({ ...form, category: 'FOOD', amount: '', description: '' })}
              className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 transition-colors text-center"
            >
              <div className="text-2xl mb-1">🍽️</div>
              <div className="text-xs text-orange-300">Quick Food</div>
            </button>
            <button 
              type="button"
              onClick={() => setForm({ ...form, category: 'TRAVEL', amount: '', description: '' })}
              className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-center"
            >
              <div className="text-2xl mb-1">✈️</div>
              <div className="text-xs text-blue-300">Quick Travel</div>
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input 
                className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-500 transition-colors" 
                placeholder="Enter expense description..."
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select 
                className="w-full bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-500 transition-colors" 
                value={form.category} 
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                <option value="TRAVEL">✈️ Travel</option>
                <option value="FOOD">🍽️ Food</option>
                <option value="OFFICE">🏢 Office</option>
                <option value="OTHER">📦 Other</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
              <input 
                id="reimb" 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" 
                checked={form.reimbursable} 
                onChange={e => setForm({ ...form, reimbursable: e.target.checked })} 
              />
              <label htmlFor="reimb" className="text-sm font-medium">Reimbursable</label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0.01"
                    className="w-full pl-8 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-500 transition-colors" 
                    placeholder="0.00"
                    value={form.amount} 
                    onChange={e => {
                      const value = e.target.value;
                      setForm({ ...form, amount: value });
                    }}
                    onBlur={e => {
                      // Format the amount to 2 decimal places
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
                <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0"
                    max="100"
                    className="w-full pr-8 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-500 transition-colors" 
                    placeholder="18.00"
                    value={form.taxRate} 
                    onChange={e => {
                      const value = e.target.value;
                      setForm({ ...form, taxRate: value });
                    }}
                    onBlur={e => {
                      // Format the tax rate to 2 decimal places
                      if (e.target.value) {
                        const formatted = parseFloat(e.target.value).toFixed(2);
                        setForm({ ...form, taxRate: formatted });
                      }
                    }}
                    required 
                  />
                </div>
              </div>
              
              {/* Preview Total */}
              {form.amount && form.taxRate && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg col-span-2">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Total Amount</p>
                    <p className="text-xl font-bold text-blue-400">
                      ₹{(parseFloat(form.amount) + (parseFloat(form.amount) * parseFloat(form.taxRate) / 100)).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Base: ₹{parseFloat(form.amount).toFixed(2)} + Tax: ₹{(parseFloat(form.amount) * parseFloat(form.taxRate) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full btn btn-primary col-span-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Expense
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Expenses List */}
      <div className="lg:col-span-3 space-y-6">
        {/* Filters */}
        <div className="card p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="sm:col-span-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  placeholder="Search expenses..." 
                  className="w-full pl-10 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-500 transition-colors" 
                  value={params.search} 
                  onChange={e => setParams({ ...params, search: e.target.value, page: 1 })} 
                />
              </div>
            </div>
            <select 
              className="w-full bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-500 transition-colors" 
              value={params.category} 
              onChange={e => setParams({ ...params, category: e.target.value, page: 1 })}
            >
              <option value="">All Categories</option>
              <option value="TRAVEL">✈️ Travel</option>
              <option value="FOOD">🍽️ Food</option>
              <option value="OFFICE">🏢 Office</option>
              <option value="OTHER">📦 Other</option>
            </select>
            <select 
              className="w-full bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-500 transition-colors" 
              value={params.reimbursable} 
              onChange={e => setParams({ ...params, reimbursable: e.target.value, page: 1 })}
            >
              <option value="">All Expenses</option>
              <option value="true">Reimbursable</option>
              <option value="false">Non-reimbursable</option>
            </select>
            <select 
              className="w-full bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-500 transition-colors" 
              value={params.sort} 
              onChange={e => setParams({ ...params, sort: e.target.value })}
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="amount:asc">Amount (Low to High)</option>
              <option value="amount:desc">Amount (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="card p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading expenses...</p>
              </div>
            </div>
          ) : list.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No expenses found</h3>
              <p className="text-gray-400 mb-4">Start by adding your first expense using the form on the left.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-3">Description</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Amount</th>
                    <th className="text-left p-3">Tax</th>
                    <th className="text-left p-3">Total</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.items.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-800/50 transition-colors border-b border-gray-700">
                      <td className="p-3">
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(expense.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                          <span className="font-medium">{expense.category}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        {expense.reimbursable ? (
                          <span className="badge badge-success">Reimbursable</span>
                        ) : (
                          <span className="badge badge-neutral">Personal</span>
                        )}
                      </td>
                      <td className="p-3 font-medium">₹{expense.amount.toFixed(2)}</td>
                      <td className="p-3 text-gray-400">{expense.taxRate.toFixed(2)}%</td>
                      <td className="p-3">
                        <div className="font-bold text-lg text-green-400">
                          ₹{expense.grandTotal.toFixed(2)}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => onEditExpense(expense)}
                            className="btn btn-secondary text-xs px-3 py-1"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteExpense(expense.id)}
                            className="btn btn-danger text-xs px-3 py-1"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {list.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-700">
              <div className="text-sm text-gray-400 text-center sm:text-left">
                Showing {((params.page - 1) * params.pageSize) + 1} to {Math.min(params.page * params.pageSize, list.total)} of {list.total} expenses
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="btn btn-secondary text-sm px-4 py-2" 
                  disabled={params.page <= 1} 
                  onClick={() => setParams({ ...params, page: params.page - 1 })}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium">
                  Page {params.page} of {Math.max(1, Math.ceil(list.total / params.pageSize))}
                </span>
                <button 
                  className="btn btn-secondary text-sm px-4 py-2" 
                  disabled={params.page >= Math.ceil(list.total / params.pageSize)} 
                  onClick={() => setParams({ ...params, page: params.page + 1 })}
                >
                  Next
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
