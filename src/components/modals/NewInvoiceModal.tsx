import React, { useState } from 'react';
import { Receipt, Plus, Trash2 } from 'lucide-react';
import { Invoice, InvoiceItem } from '../../types';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (invoice: Omit<Invoice, 'id'>) => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  isOpen,
  onClose,
  onCreateInvoice
}) => {
  const [company, setCompany] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [dueDate, setDueDate] = useState('2026-09-30');
  const [taxRate, setTaxRate] = useState(0.0825);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Enterprise Platform Cloud License (Annual)', quantity: 1, unitPrice: 45000, amount: 45000 }
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: String(Date.now()), description: 'Professional Services / Integration Support', quantity: 1, unitPrice: 10000, amount: 10000 }
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: keyof InvoiceItem, val: any) => {
    const next = [...items];
    const item = { ...next[idx], [field]: val };
    if (field === 'quantity' || field === 'unitPrice') {
      item.amount = Number(item.quantity) * Number(item.unitPrice);
    }
    next[idx] = item;
    setItems(next);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !customerEmail) return;

    onCreateInvoice({
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || 'Authorized Contact',
      customerEmail,
      company,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      items,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: 'Sent',
      currency: 'USD',
      notes: 'Payment terms: Net 30 days.'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Create ERP Accounts Receivable Invoice</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Account *</label>
              <input
                type="text"
                required
                placeholder="Apex Technologies Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Email *</label>
              <input
                type="email"
                required
                placeholder="billing@apextech.io"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Contact Name</label>
              <input
                type="text"
                placeholder="Sarah Jenkins"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Line Items List */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Line Items</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            {items.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  className="col-span-6 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                  className="col-span-2 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center"
                />
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                  className="col-span-3 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-right"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="col-span-1 text-slate-400 hover:text-red-500 text-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Totals Calculation */}
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <div className="w-48 space-y-1 text-right">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax:</span>
                <span>${taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                <span>Total:</span>
                <span className="text-indigo-600">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
