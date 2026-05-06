import { motion } from "motion/react";
import { 
  Leaf, 
  ShieldCheck, 
  Award, 
  Users, 
  ShoppingCart, 
  Phone, 
  ChevronRight,
  Star,
  CheckCircle2,
  Menu,
  X,
  Lock
} from "lucide-react";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth, loginWithGoogle } from './lib/firebase';
import AdminPanel from './components/AdminPanel';
import CartPanel from './components/CartPanel';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === (product.id || product.name));
      if (existing) {
        return prev.map(item => item.id === (product.id || product.name) ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, id: product.id || product.name, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      setIsAdminLoggedIn(!!user);
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prodList: any[] = [];
      snapshot.forEach(doc => prodList.push({ id: doc.id, ...doc.data() }));
      setProducts(prodList);
    });

    return () => {
      unsubAuth();
      unsubProducts();
    };
  }, []);

  const handleAdminClick = async () => {
    if (isAdminLoggedIn) {
      setShowAdminPanel(true);
    } else {
      await loginWithGoogle();
    }
  };

  const defaultProducts = [
    {
      name: "Kopi 7 Elemen",
      desc: "Kopi sinergi 7 elemen herba tumbuhan (biji, akar, batang, kulit kayu, daun, bunga, dan buah) untuk stamina optimal.",
      price: "Rp 110.000",
      img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Minyak Herba Sinergi (MHS)",
      desc: "Minyak ajaib multiguna untuk urut, pijat, luka, dan berbagai keluhan kesehatan sehari-hari.",
      price: "Rp 45.000",
      img: "https://images.unsplash.com/photo-1628144062088-75c1a8e1bbf3?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Pasta Gigi Herbal",
      desc: "Perawatan gigi dan mulut dengan kandungan siwak, sirih, dan mint tanpa fluoride.",
      price: "Rp 20.000",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  return (
    <div className="min-h-screen font-sans bg-white text-gray-800">
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} />
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div 
                onClick={handleAdminClick}
                className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:bg-emerald-700 transition"
                title="Admin Login"
              >
                H
              </div>
              <div>
                <span className="font-bold text-xl text-emerald-800 leading-tight block">Halal Mart</span>
                <span className="text-xs text-gray-500 font-medium tracking-widest block uppercase">HNI HPAI</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#beranda" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Beranda</a>
              <a href="#keunggulan" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Keunggulan</a>
              <a href="#produk" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Produk</a>
              <a href="#testimoni" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Testimoni</a>
              <button 
                onClick={handleAdminClick} 
                className="opacity-10 hover:opacity-100 transition-opacity p-2 text-gray-400"
                title="Admin Area"
              >
                <Lock className="w-4 h-4" />
              </button>
              <button onClick={() => setIsCartOpen(true)} className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Belanja {cart.reduce((acc, item) => acc + item.qty, 0) > 0 && `(${cart.reduce((acc, item) => acc + item.qty, 0)})`}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={handleAdminClick} 
                className="opacity-10 hover:opacity-100 transition-opacity p-2 text-gray-400 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-emerald-600 focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#beranda" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-md font-medium">Beranda</a>
              <a href="#keunggulan" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-md font-medium">Keunggulan</a>
              <a href="#produk" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-md font-medium">Produk</a>
              <a href="#testimoni" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-md font-medium">Testimoni</a>
              <button onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-md font-bold flex items-center gap-2">
                Keranjang Belanja {cart.reduce((acc, item) => acc + item.qty, 0) > 0 && `(${cart.reduce((acc, item) => acc + item.qty, 0)})`}
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-emerald-50/50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-green-100/50 blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 font-semibold text-sm mb-6 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                  100% Halal & Thayyib
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                  Sehat Alami Bersama <br/>
                  <span className="text-emerald-600">Herbal Berkualitas</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                  Temukan rangkaian produk herbal inovatif yang aman, halal, dan berkhasiat untuk menjaga kesehatan keluarga Anda. Mulai gaya hidup sehat dari sekarang.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="#produk" className="bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 text-lg">
                    Belanja Sekarang <ChevronRight className="w-5 h-5" />
                  </a>
                  <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20tanya%20prosedur%20Gabung%20Mitra%20HNI." target="_blank" rel="noreferrer" className="bg-white text-emerald-700 border-2 border-emerald-100 px-8 py-3.5 rounded-full font-bold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 text-lg">
                    <Users className="w-5 h-5" />
                    Gabung Mitra
                  </a>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 relative"
            >
              <div className="relative w-full max-w-md mx-auto aspect-square">
                {/* Decorative background circle */}
                <div className="absolute inset-0 bg-emerald-200 rounded-full opacity-20 transform -rotate-6 scale-105" />
                <div className="absolute inset-0 bg-green-100 rounded-full opacity-30 transform rotate-3" />
                <img 
                  src="https://images.unsplash.com/photo-1611078486968-3843dd256195?auto=format&fit=crop&q=80&w=800" 
                  alt="Herbal Natural Products" 
                  className="relative z-10 w-full h-full object-cover rounded-[2rem] shadow-2xl border-4 border-white"
                />
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20 animate-bounce" style={{animationDuration: '3s'}}>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Terjamin</p>
                    <p className="text-sm font-bold text-gray-900">Kualitas Premium</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="keunggulan" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-emerald-600 tracking-wider uppercase mb-2">Kenapa Memilih Kami?</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">Keunggulan Produk HNI HPAI</h3>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8 flex-shrink-0" />,
                title: "100% Halal",
                desc: "Sertifikasi halal resmi, memberikan ketenangan dan keberkahan dalam setiap produk."
              },
              {
                icon: <Leaf className="w-8 h-8 flex-shrink-0" />,
                title: "Herbal Alami",
                desc: "Terbuat dari bahan-bahan alami pilihan tanpa bahan kimia sintetis yang berbahaya."
              },
              {
                icon: <Award className="w-8 h-8 flex-shrink-0" />,
                title: "Thayyib & Aman",
                desc: "Diproses dengan standar kualitas tinggi, higienis, dan aman untuk dikonsumsi harian."
              },
              {
                icon: <Users className="w-8 h-8 flex-shrink-0" />,
                title: "Sistem Syariah",
                desc: "Bisnis yang dijalankan dengan prinsip syariah yang adil dan menguntungkan mitra."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-emerald-100 hover:shadow-lg hover:bg-emerald-50/30 transition-all block text-center"
              >
                <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-3">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="produk" className="py-20 bg-emerald-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold text-emerald-400 tracking-wider uppercase mb-2">Etalase Kami</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold">Produk Terlaris HNI</h3>
            </div>
            <button className="hidden md:flex items-center gap-2 text-emerald-300 hover:text-white transition-colors font-medium">
              Lihat Semua Produk <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayProducts.map((prod, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-xl transform transition hover:-translate-y-2 group text-gray-800 flex flex-col">
                <div className="h-60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <img src={prod.img} alt={prod.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-600">
                    Best Seller
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{prod.name}</h4>
                  <p className="text-gray-600 text-sm mb-4 flex-1">{prod.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-extrabold text-emerald-600">{prod.price}</span>
                    <button onClick={() => addToCart(prod)} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white p-2.5 rounded-xl transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-8 md:hidden w-full flex items-center justify-center gap-2 text-emerald-100 hover:text-white bg-white/10 p-4 rounded-xl transition-colors font-medium border border-white/20">
              Lihat Semua Produk <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Business Opportunity / Join Member */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-32 bg-emerald-700 rounded-full blur-[100px] opacity-70 transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 p-32 bg-emerald-900 rounded-full blur-[100px] opacity-50 transform -translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center p-8 lg:p-16 gap-12">
              <div className="flex-1 text-white">
                <h3 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">Mulai Bisnis Berkah Bersama HNI</h3>
                <p className="text-emerald-100 text-lg mb-8 leading-relaxed max-w-xl">
                  Dapatkan diskon untuk pembelanjaan pribadi, keuntungan dari penjualan retail, dan bonus menarik dengan membangun jaringan bisnis halal yang luas.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    "Diskon Harga Agen (Hingga 30%)",
                    "Akses Virtual Office Berbasis Web",
                    "Pembinaan & Mentoring Bisnis",
                    "Bonus Pembelanjaan Pribadi & Jaringan"
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
                <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20tertarik%20untuk%20Daftar%20Menjadi%20Agen%20HNI." target="_blank" rel="noreferrer" className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition-colors shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center text-lg">
                  Daftar Jadi Agen Sekarang <ChevronRight className="w-5 h-5" />
                </a>
              </div>
              <div className="w-full lg:w-2/5">
                <img 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" 
                  alt="Business Meeting" 
                  className="rounded-2xl shadow-xl w-full object-cover border-4 border-emerald-700/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-emerald-600 tracking-wider uppercase mb-2">Kisah Sukses</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">Apa Kata Mereka?</h3>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "Sejak memakai Pasta Gigi Herbal HNI, masalah gusi sensitif saya berkurang drastis. Alhamdulillah cocok dan aman karena bebas fluoride.",
                name: "Siti Nurhaliza",
                role: "Ibu Rumah Tangga",
                rating: 5
              },
              {
                text: "Minyak Herba Sinergi ini pertolongan pertama di rumah. Dari luka gores, gigitan serangga, sampai pijat pegal-pegal semua bisa. Sangat bermanfaat!",
                name: "Budi Santoso",
                role: "Karyawan Swasta",
                rating: 5
              },
              {
                text: "Memutuskan jadi agen HNI adalah pilihan tepat. Selain produknya bagus dipakai sendiri, bonusnya lumayan untuk tambah pemasukan keluarga.",
                name: "Aisyah",
                role: "Agen HNI HPAI",
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full -z-10 rounded-tr-2xl" />
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">{testimonial.name}</h5>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-10" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Siap Memulai Gaya Hidup Sehat & Berkah?</h2>
          <p className="text-emerald-100 text-lg mb-8">Pesan produk sekarang atau bergabung menjadi mitra kami untuk mendapatkan harga yang lebih hemat.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/6281234567890?text=Halo%20Admin%20Halal%20Mart,%20saya%20ingin%20bertanya." target="_blank" rel="noreferrer" className="bg-white text-emerald-700 px-8 py-3.5 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg text-lg flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" /> Hubungi via WhatsApp
            </a>
            <a href="#produk" className="bg-emerald-800 text-white border border-emerald-500 px-8 py-3.5 rounded-full font-bold hover:bg-emerald-900 transition-colors shadow-lg text-lg inline-flex items-center justify-center">
              Lihat Katalog Lengkap
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6 text-white">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center font-bold text-xl">
                  H
                </div>
                <div>
                  <span className="font-bold text-xl leading-tight block">Halal Mart</span>
                  <span className="text-xs text-emerald-400 font-medium tracking-widest block uppercase">HNI HPAI</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Menyediakan berbagai macam produk herbal halal dan berkualitas untuk kesehatan, kecantikan, dan kebutuhan rumah tangga sehari-hari.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Tautan Cepat</h4>
              <ul className="space-y-3">
                <li><a href="#beranda" className="hover:text-emerald-400 transition-colors">Beranda</a></li>
                <li><a href="#keunggulan" className="hover:text-emerald-400 transition-colors">Tentang Kami</a></li>
                <li><a href="#produk" className="hover:text-emerald-400 transition-colors">Katalog Produk</a></li>
                <li><a href="#testimoni" className="hover:text-emerald-400 transition-colors">Peluang Bisnis</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Bantuan</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Cara Pemesanan</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Cara Daftar Member</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Kebijakan Privasi</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hubungi Kami</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm">
                  <div className="mt-1"><Phone className="w-4 h-4 text-emerald-500" /></div>
                  <span className="text-gray-400">0812-3456-7890 (WhatsApp Cepat)</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <div className="mt-1"><Leaf className="w-4 h-4 text-emerald-500" /></div>
                  <span className="text-gray-400">Jl. Herbal Alami No.123, Jakarta Selatan, Indonesia</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Halal Mart HNI. All rights reserved.</p>
            <p>Made with &hearts; for a healthier life.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
