import React from 'react';
import { X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';

export default function CartPanel({
    isOpen,
    onClose,
    cart,
    setCart
}: {
    isOpen: boolean;
    onClose: () => void;
    cart: any[];
    setCart: React.Dispatch<React.SetStateAction<any[]>>;
}) {
    if (!isOpen) return null;

    const updateQty = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const parsePrice = (priceStr: string) => {
         const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
         return isNaN(num) ? 0 : num;
    };

    const total = cart.reduce((acc, item) => acc + parsePrice(item.price) * item.qty, 0);
    const formatPrice = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        let text = "Halo Admin, saya ingin memesan:\n\n";
        cart.forEach((item, index) => {
            text += `${index + 1}. ${item.name} (${item.qty}x) - ${item.price}\n`;
        });
        text += `\n*Total Estimasi: ${formatPrice(total)}*\n\nMohon info ketersediaan produk dan ongkos kirim. Terima kasih.`;
        
        const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">Keranjang Belanja</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                            <span className="text-4xl mb-4">🛒</span>
                            <p>Keranjang belanja Anda masih kosong</p>
                        </div>
                    ) : cart.map((item) => (
                        <div key={item.id} className="flex gap-4 border border-gray-100 p-3 rounded-xl hover:shadow-sm transition-shadow">
                            <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-sm text-gray-900 leading-tight">{item.name}</h3>
                                    <p className="text-emerald-600 font-bold text-sm mt-1">{item.price}</p>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                        <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600"><Minus size={14} /></button>
                                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600"><Plus size={14} /></button>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500 font-medium">Total Estimasi</span>
                        <span className="text-2xl font-extrabold text-gray-900">{formatPrice(total)}</span>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-lg disabled:shadow-none"
                    >
                        <MessageCircle size={20} /> Checkout via WhatsApp
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-4">Pesanan Anda akan dikirim ke WhatsApp Admin untuk proses selanjutnya.</p>
                </div>
            </div>
        </div>
    )
}
