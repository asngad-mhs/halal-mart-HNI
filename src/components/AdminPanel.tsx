import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, logout, auth } from '../lib/firebase';
import { LogOut, Plus, Edit2, Trash2, X, Save } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  desc: string;
  price: string;
  img: string;
}

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', desc: '', price: '', img: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const prodList: Product[] = [];
        snapshot.forEach((doc) => {
          prodList.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(prodList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
        setError('Gagal memuat produk. Anda mungkin tidak memiliki izin.');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'products'), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setFormData({ name: '', desc: '', price: '', img: '' });
    } catch (err: any) {
      setError(err.message || 'Error saat menambahkan produk');
      handleFirestoreError(err, OperationType.CREATE, 'products');
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    setError('');
    try {
      const prodRef = doc(db, 'products', editingId);
      await updateDoc(prodRef, {
        ...formData,
        updatedAt: serverTimestamp()
      });
      setEditingId(null);
      setFormData({ name: '', desc: '', price: '', img: '' });
    } catch (err: any) {
      setError(err.message || 'Error saat mengupdate produk');
      handleFirestoreError(err, OperationType.UPDATE, `products/${editingId}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return;
    setError('');
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err: any) {
      setError(err.message || 'Error saat menghapus produk');
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  const startEdit = (prod: Product) => {
    setEditingId(prod.id);
    setFormData({ name: prod.name, desc: prod.desc, price: prod.price, img: prod.img });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', desc: '', price: '', img: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col h-screen overflow-hidden">
      <header className="bg-emerald-800 text-white p-4 flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold">Admin Panel HNI</h2>
        <div className="flex gap-4">
          <button onClick={() => { logout(); onClose(); }} className="flex gap-2 items-center hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors text-sm">
            <LogOut size={16} /> Keluar
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-emerald-700 rounded-lg transition-colors">
            <X />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
            <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (contoh: Rp 45.000)</label>
                  <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
                  <input required value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Pendek</label>
                  <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" rows={3}></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Batal</button>
                )}
                <button type="submit" disabled={loading} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center gap-2">
                  {loading ? 'Menyimpan...' : editingId ? <><Save size={18}/> Simpan Perubahan</> : <><Plus size={18}/> Tambah Produk</>}
                </button>
              </div>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Daftar Produk</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-semibold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Produk</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                        Belum ada produk. Tambahkan produk pertama Anda di atas.
                      </td>
                    </tr>
                  ) : products.map(prod => (
                    <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={prod.img} alt={prod.name} className="w-12 h-12 rounded object-cover border border-gray-100" />
                          <div>
                            <div className="font-bold text-gray-900">{prod.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{prod.desc}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{prod.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEdit(prod)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(prod.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
