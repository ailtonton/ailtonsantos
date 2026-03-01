
import React, { useState, useEffect } from 'react';
import { Camera, Search, X, Info, ChevronRight, Box, Menu, LayoutGrid, Layers, Scissors, Tag, Sparkles, Loader2, RefreshCw, Download, Trophy, CheckCircle2, AlertCircle, HelpCircle, MapPin, Store, Phone, LogOut } from 'lucide-react';
import { Product, Resale, ResaleStock } from '../types';
import { apiService } from '../services/apiService';
import Scanner from './Scanner';

interface CatalogAppProps {
  products: Product[];
  onLogout: () => void;
}

const CatalogApp: React.FC<CatalogAppProps> = ({ products, onLogout }) => {
  const [resales, setResales] = useState<Resale[]>([]);
  const [resaleStock, setResaleStock] = useState<ResaleStock[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const loadResales = async () => {
      const [r, s] = await Promise.all([apiService.getResales(), apiService.getResaleStock()]);
      setResales(r);
      setResaleStock(s);
    };
    loadResales();
  }, [showMapModal]);

  // Extrair categorias únicas dos produtos
  const categories = Array.from(new Set(products.map(p => p.categoria)));

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.categoria === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const getResalesWithStock = (productId: string) => {
    return resales.map(resale => {
      const stock = resaleStock.find(s => s.resaleId === resale.id && s.productId === productId);
      return { ...resale, qty: stock?.quantidade || 0 };
    }).filter(r => r.qty > 0);
  };

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black flex flex-col relative pb-24 overflow-x-hidden border-x border-white/5 font-sans">
      
      {/* Sidebar Menu Drawer */}
      <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Menu Content */}
        <aside className={`relative w-72 bg-zinc-950 h-full shadow-2xl transition-transform duration-300 ease-out flex flex-col border-r border-white/10 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-8 border-b border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black italic tracking-tighter text-white">5MAXX</h2>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
            </div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Menu de Navegação</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-6 space-y-2">
            <button 
              onClick={() => { setSelectedCategory(null); setIsMenuOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${selectedCategory === null ? 'bg-white text-black font-black' : 'text-white/40 hover:bg-white/5'}`}
            >
              <LayoutGrid size={18} />
              <span className="text-[10px] uppercase tracking-widest">Ver Tudo</span>
            </button>

            <div className="pt-4 pb-2">
              <p className="px-4 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Categorias</p>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setIsMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all mb-1 ${selectedCategory === cat ? 'bg-amber-500 text-black font-black' : 'text-white/40 hover:bg-white/5'}`}
                >
                  <Tag size={18} />
                  <span className="text-[10px] uppercase tracking-widest">{cat}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="p-6 border-t border-white/5">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all group"
            >
              <LogOut size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Sair da Conta</span>
            </button>
          </div>
        </aside>
      </div>

      {/* App Header */}
      <header className="bg-black text-white p-7 sticky top-0 z-40 border-b border-white/10">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 text-white hover:opacity-70 transition-opacity">
            <Menu size={28} />
          </button>
          <div className="flex flex-col items-center">
             <h1 className="text-4xl font-black italic tracking-tighter leading-none text-white">5MAXX</h1>
             <span className="text-[7px] font-light tracking-[0.4em] uppercase opacity-40 mt-1">Innovating Beyond</span>
          </div>
          <button onClick={() => setIsScanning(true)} className="p-2 -mr-2 text-white hover:opacity-70 transition-opacity">
            <Camera size={26} />
          </button>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Pesquisar catálogo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-2xl py-4 px-12 text-sm text-black font-bold outline-none placeholder:text-zinc-400"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* Category Indicator */}
        {selectedCategory && (
          <div className="mt-4 flex items-center justify-between bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Filtrando: {selectedCategory}</span>
            <button onClick={() => setSelectedCategory(null)} className="text-amber-500"><X size={14}/></button>
          </div>
        )}
      </header>

      {/* Grid de Produtos */}
      <main className="p-6 flex-1 bg-gradient-to-b from-black to-zinc-950">
        <div className="grid grid-cols-1 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(p => (
              <div 
                key={p.id} 
                onClick={() => setSelectedProduct(p)}
                className="bg-zinc-900/40 p-5 rounded-[2.5rem] border border-white/5 flex gap-5 items-center hover:bg-zinc-900 transition-all cursor-pointer group"
              >
                <img src={p.imageUrl} alt={p.nome} className="w-24 h-24 aspect-square object-cover rounded-[1.5rem] border border-white/5 bg-zinc-800" />
                <div className="flex-1">
                  <p className="text-[9px] font-black text-white/30 mb-1 uppercase tracking-widest">{p.sku}</p>
                  <p className="text-lg font-black text-white uppercase italic truncate">{p.nome}</p>
                  <div className="mt-4 flex items-center gap-2 text-amber-500">
                    <span className="text-[9px] font-black uppercase tracking-widest">Detalhes Técnicos</span>
                    <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-white/20" />
              </div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal Onde Encontrar */}
      {showMapModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[250] flex flex-col items-center justify-start p-6 animate-slide-up overflow-y-auto">
           <button onClick={() => setShowMapModal(false)} className="absolute top-10 right-8 text-white/40 hover:text-white transition-all"><X size={32} /></button>

           <div className="w-full max-w-sm mt-16 pb-20">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                  <MapPin size={14} className="text-amber-500" />
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Estoque na Rede</span>
                </div>
                <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">{selectedProduct.nome}</h2>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.3em] mt-3">Disponibilidade Imediata em Revendas</p>
              </div>

              <div className="space-y-6">
                {getResalesWithStock(selectedProduct.id).length === 0 ? (
                  <div className="bg-zinc-900/50 p-12 rounded-[3rem] text-center border border-white/5">
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest leading-loose">Produto sem estoque em revendas próximas no momento.</p>
                  </div>
                ) : getResalesWithStock(selectedProduct.id).map(r => (
                  <div key={r.id} className="bg-zinc-900 p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group hover:border-amber-500/50 transition-all">
                    <div className="absolute top-0 right-0 p-4">
                       <div className="bg-amber-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2">
                          <Box size={12} />
                          {r.qty} UNID.
                       </div>
                    </div>
                    <h4 className="text-xl font-black italic uppercase text-white mb-2">{r.nome}</h4>
                    <p className="text-white/40 text-[10px] font-bold uppercase mb-6 flex items-center gap-2"><MapPin size={12} /> {r.endereco}, {r.cidade}</p>
                    <div className="flex gap-4">
                       <a href={`tel:${r.telefone}`} className="flex-1 bg-white/5 border border-white/10 text-white p-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all">
                          <Phone size={16} />
                          <span className="text-[10px] font-black uppercase">Ligar</span>
                       </a>
                       <button className="flex-1 bg-amber-500 text-black p-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase shadow-lg shadow-amber-500/10">
                          <MapPin size={16} /> Rota
                       </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                 <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.4em]">Os estoques são atualizados pelas unidades a cada 1h</p>
              </div>
           </div>
        </div>
      )}

      {/* Ficha Técnica Modal */}
      {selectedProduct && !showMapModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[110] flex items-end">
          <div className="bg-zinc-950 w-full max-w-md mx-auto rounded-t-[3.5rem] p-10 animate-slide-up shadow-2xl border-t border-white/10">
            <div className="flex justify-center mb-8"><div className="w-16 h-1 bg-white/10 rounded-full"></div></div>
            <div className="flex gap-6 mb-10">
              <img src={selectedProduct.imageUrl} className="w-28 h-28 rounded-3xl object-cover border border-white/10" />
              <div className="flex-1">
                <p className="text-[9px] font-black text-white/40 uppercase mb-2">{selectedProduct.sku}</p>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-tight">{selectedProduct.nome}</h3>
              </div>
            </div>
            <div className="bg-white/5 p-6 rounded-3xl mb-6 border border-white/5">
               <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-3">Descrição Premium</p>
               <p className="text-white/60 text-sm leading-relaxed">{selectedProduct.descricaoTecnica}</p>
            </div>

            {selectedProduct.youtubeUrl && getYoutubeId(selectedProduct.youtubeUrl) && (
              <div className="mb-8 rounded-3xl overflow-hidden border border-white/10 aspect-video bg-black">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${getYoutubeId(selectedProduct.youtubeUrl)}`}
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <button 
              onClick={() => setShowMapModal(true)}
              className="w-full bg-amber-500 text-black py-6 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
            >
              <MapPin size={20} /> Onde Encontrar este Item
            </button>
            <button onClick={() => setSelectedProduct(null)} className="w-full mt-4 py-4 text-white/30 uppercase font-black text-[10px]">Fechar</button>
          </div>
        </div>
      )}
      
      {isScanning && <Scanner onScan={(code) => { const f = products.find(p => p.sku === code); if (f) setSelectedProduct(f); setIsScanning(false); }} onClose={() => setIsScanning(false)} />}
    </div>
  );
};

export default CatalogApp;
