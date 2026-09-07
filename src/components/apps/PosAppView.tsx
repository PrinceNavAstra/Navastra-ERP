import React, { useMemo, useState } from 'react';
import {
    Barcode,
    CreditCard,
    ScanLine,
    Search,
    ShoppingCart,
    CircleDollarSign,
    QrCode,
    Plus,
    Minus,
    Sparkles,
    Smartphone,
    UserRound,
    Package,
    ReceiptText,
    ArrowRight,
    CheckCircle2,
} from 'lucide-react';

interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    color: string;
    badge: string;
}

interface CartItem {
    id: number;
    name: string;
    sku: string;
    price: number;
    qty: number;
}

const catalog: InventoryItem[] = [
    { id: 1, name: 'Wireless Headset Pro', sku: 'WH-104', category: 'Electronics', price: 249, stock: 18, color: 'from-cyan-500 to-sky-500', badge: 'Hot' },
    { id: 2, name: 'Smart Watch X9', sku: 'SW-209', category: 'Wearables', price: 429, stock: 11, color: 'from-violet-500 to-fuchsia-500', badge: 'New' },
    { id: 3, name: '4K Ultra Display', sku: 'KD-315', category: 'Office', price: 899, stock: 6, color: 'from-amber-500 to-orange-500', badge: 'Deal' },
    { id: 4, name: 'Ergo Office Chair', sku: 'ER-411', category: 'Furniture', price: 639, stock: 9, color: 'from-emerald-500 to-teal-500', badge: 'Best' },
    { id: 5, name: 'Mechanical Keyboard', sku: 'MK-548', category: 'Accessories', price: 179, stock: 22, color: 'from-rose-500 to-pink-500', badge: 'Top' },
    { id: 6, name: 'Portable Speaker', sku: 'PS-820', category: 'Audio', price: 129, stock: 32, color: 'from-indigo-500 to-blue-500', badge: 'Promo' },
];

const paymentMethods = ['Cash', 'Card', 'Wallet', 'Split'];

export const PosAppView: React.FC = () => {
    const [search, setSearch] = useState('');
    const [scanValue, setScanValue] = useState('NAV-2102');
    const [activePayment, setActivePayment] = useState('Card');
    const [cart, setCart] = useState<CartItem[]>([
        { id: 2, name: 'Smart Watch X9', sku: 'SW-209', price: 429, qty: 1 },
        { id: 5, name: 'Mechanical Keyboard', sku: 'MK-548', price: 179, qty: 2 },
    ]);

    const filteredProducts = useMemo(() => {
        return catalog.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.sku.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const addToCart = (item: InventoryItem) => {
        setCart((prev) => {
            const existing = prev.find((entry) => entry.id === item.id);
            if (existing) {
                return prev.map((entry) =>
                    entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry
                );
            }
            return [...prev, { id: item.id, name: item.name, sku: item.sku, price: item.price, qty: 1 }];
        });
    };

    const updateQty = (id: number, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
                )
                .filter((item) => item.qty > 0)
        );
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    return (
        <div className="space-y-6 animate-in fade-in duration-200 p-2 md:p-4">
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 space-y-6">
                    <div className="bg-white dark:bg-[#121a2b] rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-[0_14px_32px_rgba(15,23,42,0.08)] p-5 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold tracking-[0.18em]">
                                        POS RETAIL
                                    </span>
                                    <span className="text-[11px] text-slate-400 dark:text-slate-500">Live checkout</span>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Navastra Point of Sale</h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#172132] text-slate-700 dark:text-slate-200 text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-[#1b2842] transition-colors">
                                    Hold Order
                                </button>
                                <button className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-bold shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all">
                                    New Session
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-[#121a2b] rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Transactions</span>
                                <ShoppingCart className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="mt-3 flex items-end justify-between">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">1,284</span>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+8.2%</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#121a2b] rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Average Basket</span>
                                <CircleDollarSign className="w-4 h-4 text-amber-500" />
                            </div>
                            <div className="mt-3 flex items-end justify-between">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">$684</span>
                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">+12.4%</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#121a2b] rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Turnover</span>
                                <Sparkles className="w-4 h-4 text-violet-500" />
                            </div>
                            <div className="mt-3 flex items-end justify-between">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">$89.2k</span>
                                <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">Today</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#121a2b] rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-[0_12px_22px_rgba(15,23,42,0.06)] p-5">
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                            <div className="flex-1">
                                <label className="block text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-2">Barcode or scanner input</label>
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f172a] px-3 py-3">
                                    <Barcode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <input
                                        value={scanValue}
                                        onChange={(e) => setScanValue(e.target.value)}
                                        placeholder="Scan product or type SKU"
                                        className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                                    />
                                    <button className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors">
                                        Quick Scan
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f172a] p-3 flex items-center justify-center">
                                    <QrCode className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                                </div>
                                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f172a] p-3 flex items-center justify-center">
                                    <ScanLine className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#121a2b] rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-[0_12px_22px_rgba(15,23,42,0.06)] p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Product catalog</h3>
                            </div>

                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#101827] text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    placeholder="Search by name or SKU"
                                />
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredProducts.map((item) => (
                                <div
                                    key={item.id}
                                    className="group rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-[#121a2b] dark:to-[#101827] p-3 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70 dark:hover:shadow-slate-950/30"
                                >
                                    <div className={`h-24 rounded-2xl bg-gradient-to-br ${item.color} relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.5),transparent_55%)]" />
                                        <div className="absolute right-3 top-3 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold text-white">
                                            {item.badge}
                                        </div>
                                        <div className="absolute left-3 bottom-3 flex items-center gap-1.5 rounded-full bg-slate-900/20 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold text-white">
                                            <Barcode className="w-3 h-3" /> {item.sku}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-start justify-between gap-3">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{item.category}</p>
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">${item.price}</span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Stock {item.stock}</span>
                                        <button
                                            type="button"
                                            onClick={() => addToCart(item)}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-2.5 py-1.5 text-[11px] font-bold transition-transform hover:scale-[1.02]"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="w-full xl:w-[420px] shrink-0">
                    <div className="bg-white dark:bg-[#121a2b] rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-[0_12px_22px_rgba(15,23,42,0.06)] p-5">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <ShoppingCart className="w-5 h-5" />
                                </span>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Current basket</p>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Order #1058</h3>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">Customer</p>
                                <div className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                    <UserRound className="w-4 h-4 text-slate-500" /> Walk-in
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mt-4">
                            {cart.map((item) => (
                                <div key={item.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f172a] p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.sku}</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">${item.price * item.qty}</p>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121a2b] p-1">
                                            <button
                                                type="button"
                                                onClick={() => updateQty(item.id, -1)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#162033]"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="min-w-6 text-center text-xs font-bold text-slate-900 dark:text-white">{item.qty}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateQty(item.id, 1)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#162033]"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">@ ${item.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f172a] p-3">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                <span>Payment method</span>
                                <span className="text-emerald-600 dark:text-emerald-400">Ready</span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setActivePayment(method)}
                                        className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-colors ${activePayment === method
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-white dark:bg-[#121a2b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                            }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                            <div className="flex items-center justify-between">
                                <span>Subtotal</span>
                                <span className="font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Tax (12%)</span>
                                <span className="font-bold text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                                <span className="text-base font-black text-slate-900 dark:text-white">Total</span>
                                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-5 flex gap-2">
                            <button className="flex-1 px-3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#101827] text-slate-700 dark:text-slate-200 font-bold text-sm">
                                Save Draft
                            </button>
                            <button className="flex-1 px-3 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                                Checkout <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mt-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-[#0b1322] dark:to-[#111827] p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[11px] uppercase tracking-[0.15em] text-slate-300">Payment status</span>
                                </div>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="mt-3 text-2xl font-black">{activePayment}</div>
                            <div className="mt-1 text-[11px] text-slate-300">Ready to process with device or scanner</div>
                        </div>

                        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f172a] p-3">
                            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Reader</div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white">QR / NFC / Barcode</div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <div className="bg-white dark:bg-[#121a2b] rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-[0_12px_22px_rgba(15,23,42,0.06)] p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <ReceiptText className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">POS intelligence</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">Connected</span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f172a] p-4">
                        <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Barcode scan</div>
                        <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">98.4%</div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Accuracy rate</div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f172a] p-4">
                        <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">QR payments</div>
                        <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">14</div>
                        <div className="text-[11px] text-violet-600 dark:text-violet-400">Wallet scans today</div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f172a] p-4">
                        <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Checkout speed</div>
                        <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">14s</div>
                        <div className="text-[11px] text-sky-600 dark:text-sky-400">Average per order</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
