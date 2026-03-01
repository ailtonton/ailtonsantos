
import React, { useState, useEffect, useRef } from 'react';
import { Package, QrCode, Plus, LogOut, MapPin, Edit2, Trash2, X, Image as ImageIcon, Menu, Youtube, Tag, Loader2, Save, Store, Hash } from 'lucide-react';
import { Product, Resale, ResaleStock } from '../types';
import { apiService } from '../services/apiService';

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, setProducts, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'resales'>('products');
  const [resales, setResales] = useState<Resale[]>([]);
  const [resaleStock, setResaleStock] = useState<ResaleStock[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingResale, setEditingResale] = useState<Resale | null>(null);
  const [showStockModal, setShowStockModal] = useState<Resale | null>(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);
  const resaleFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const [rData, sData] = await Promise.all([apiService.getResales(), apiService.getResaleStock()]);
      setResales(rData);
      setResaleStock(sData);
    };
    loadData();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current || isSaving) return;
    setIsSaving(true);
    const formData = new FormData(formRef.current);
    const data: Product = {
      id: editingProduct?.id || `temp_${Date.now()}`,
      sku: formData.get('sku') as string,
      nome: formData.get('nome') as string,
      categoria: formData.get('categoria') as string,
      descricaoTecnica: formData.get('descricaoTecnica') as string,
      preco: parseFloat(formData.get('preco') as string) || 0,
      estoque: parseInt(formData.get('estoque') as string) || 0,
      barcode: formData.get('sku') as string,
      ncm: formData.get('ncm') as string,
      imageUrl: formData.get('imageUrl') as string || 'https://images.unsplash.com/photo-1584583011663-8f6458428876?auto=format&fit=crop&q=80&w=800',
      youtubeUrl: formData.get('youtubeUrl') as string || ''
    };
    const saved = await apiService.saveProduct(data);
    setProducts(prev => editingProduct ? prev.map(p => p.id === saved.id ? saved : p) : [saved, ...prev]);
    setShowModal(false);
    setIsSaving(false);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
      await apiService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto.");
    }
  };

  const handleDeleteResale = async (id: string) => {
    try {
      if (!window.confirm('Tem certeza que deseja excluir esta revenda?')) return;
      await apiService.deleteResale(id);
      setResales(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("Erro ao excluir revenda:", error);
      alert("Erro ao excluir revenda.");
    }
  };

  const handleSaveResale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resaleFormRef.current || isSaving) return;
    setIsSaving(true);
    const formData = new FormData(resaleFormRef.current);
    const data: Resale = {
      id: editingResale?.id || `temp_${Date.now()}`,
      nome: formData.get('nome') as string,
      endereco: formData.get('endereco') as string,
      cidade: formData.get('cidade') as string,
      telefone: formData.get('telefone') as string,
      lat: -23.5, // Default for demo
      lng: -46.6
    };
    const saved = await apiService.saveResale(data);
    setResales(prev => editingResale ? prev.map(r => r.id === saved.id ? saved : r) : [saved, ...prev]);
    setShowModal(false);
    setIsSaving(false);
  };

  const handleUpdateStock = async (resaleId: string, productId: string, qty: number) => {
    await apiService.updateResaleStock(resaleId, productId, qty);
    setResaleStock(prev => {
      const idx = prev.findIndex(s => s.resaleId === resaleId && s.productId === productId);
      if (idx >= 0) return prev.map((s, i) => i === idx ? { ...s, quantidade: qty } : s);
      return [...prev, { resaleId, productId, quantidade: qty }];
    });
  };

  return (
    <div className="min-h-screen flex bg-zinc-950 text-white font-sans">
      {/* Sidebar */}
      <aside className={`bg-black border-r border-white/10 flex flex-col transition-all duration-500 shadow-2xl z-50 ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
        <div className="p-8 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex flex-col">
              <h1 className="text-3xl font-black italic tracking-tighter">5MAXX</h1>
              <span className="text-[8px] font-light tracking-[0.2em] uppercase opacity-40">Admin Panel</span>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <Menu size={20} className="text-white" />
          </button>
        </div>
        
        <nav className="flex-1 mt-10 space-y-2 px-4">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest ${activeTab === 'products' ? 'bg-white text-black font-black' : 'text-white/40 hover:bg-white/5'}`}
          >
            <Package size={20} />
            {isSidebarOpen && <span>Produtos</span>}
          </button>
          <button 
            onClick={() => setActiveTab('resales')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest ${activeTab === 'resales' ? 'bg-white text-black font-black' : 'text-white/40 hover:bg-white/5'}`}
          >
            <Store size={20} />
            {isSidebarOpen && <span>Revendas</span>}
          </button>
        </nav>

        <button onClick={onLogout} className="m-6 p-5 flex items-center gap-4 text-white/30 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5">
          <LogOut size={20} />
          {isSidebarOpen && <span className="text-[10px] font-bold uppercase tracking-widest">Sair</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-6xl font-black italic tracking-tighter mb-4 uppercase">{activeTab === 'products' ? 'Estoque Central' : 'Rede de Revendas'}</h2>
            <div className="flex items-center gap-4">
               <div className="h-1 w-12 bg-white"></div>
               <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">Gestão de Ativos 5MAXX</p>
            </div>
          </div>

          <button 
            onClick={() => { 
              if (activeTab === 'products') { setEditingProduct(null); setShowModal(true); }
              else { setEditingResale(null); setShowModal(true); }
            }}
            className="bg-white text-black px-10 py-5 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl font-black text-xs uppercase tracking-widest"
          >
            <Plus size={20} />
            Adicionar {activeTab === 'products' ? 'Produto' : 'Revenda'}
          </button>
        </header>

        <div className="bg-zinc-900/40 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-inner backdrop-blur-md">
          {activeTab === 'products' ? (
            <table className="w-full text-left">
              <thead className="bg-black/50 border-b border-white/10">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">SKU</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Produto</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6 font-mono text-xs text-white/50">{p.sku}</td>
                    <td className="px-8 py-6 flex items-center gap-4">
                      <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                      <span className="font-bold uppercase italic">{p.nome}</span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                       <button 
                         onClick={() => { setEditingProduct(p); setShowModal(true); }}
                         className="p-3 text-white/20 hover:text-white transition-all"
                       >
                         <Edit2 size={18} />
                       </button>
                       <button 
                         onClick={() => handleDeleteProduct(p.id)}
                         className="p-3 text-white/20 hover:text-red-500 transition-all"
                       >
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-black/50 border-b border-white/10">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Nome</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Localidade</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Estoque / Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {resales.map(r => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6 font-bold uppercase italic text-white">{r.nome}</td>
                    <td className="px-8 py-6 text-white/40 text-xs">{r.cidade}</td>
                    <td className="px-8 py-6 text-right space-x-2">
                       <button 
                         onClick={() => setShowStockModal(r)}
                         className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                       >
                         Gerenciar Estoque
                       </button>
                       <button 
                         onClick={() => { setEditingResale(r); setShowModal(true); }}
                         className="p-3 text-white/20 hover:text-white transition-all"
                       >
                         <Edit2 size={18} />
                       </button>
                       <button 
                         onClick={() => handleDeleteResale(r.id)}
                         className="p-3 text-white/20 hover:text-red-500 transition-all"
                       >
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal Estoque de Revenda */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-8">
          <div className="bg-zinc-950 border border-white/10 rounded-[3rem] w-full max-w-2xl p-12 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Unidade: {showStockModal.nome}</p>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Inventário da Revenda</h3>
              </div>
              <button onClick={() => setShowStockModal(null)} className="text-white/40 hover:text-white"><X size={32}/></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {products.map(p => {
                const stock = resaleStock.find(s => s.resaleId === showStockModal.id && s.productId === p.id);
                return (
                  <div key={p.id} className="bg-white/5 p-6 rounded-3xl flex items-center justify-between border border-white/5 hover:border-white/20 transition-all">
                    <div className="flex items-center gap-4">
                      <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="text-[9px] font-black text-white/30 uppercase">{p.sku}</p>
                        <p className="text-sm font-bold uppercase">{p.nome}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <Hash size={16} className="text-amber-500" />
                       <input 
                         type="number" 
                         defaultValue={stock?.quantidade || 0}
                         onBlur={(e) => handleUpdateStock(showStockModal.id, p.id, parseInt(e.target.value) || 0)}
                         className="w-20 bg-black border border-white/10 rounded-xl p-3 text-center text-sm font-black text-amber-500 outline-none focus:border-amber-500"
                       />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button 
              onClick={() => setShowStockModal(null)}
              className="mt-8 w-full bg-white text-black py-6 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              Concluir Atualização
            </button>
          </div>
        </div>
      )}

      {/* Modal Cadastro de Produto */}
      {showModal && activeTab === 'products' && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-8 overflow-y-auto">
          <form ref={formRef} onSubmit={handleSaveProduct} className="bg-zinc-950 border border-white/10 rounded-[3rem] w-full max-w-2xl p-12 shadow-2xl my-auto">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-10">
              {editingProduct ? 'Editar Produto' : 'Novo Ativo 5MAXX'}
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Nome do Produto</label>
                <input name="nome" defaultValue={editingProduct?.nome} required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-white text-white font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">SKU / Código</label>
                <input name="sku" defaultValue={editingProduct?.sku} required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-white text-white font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Categoria</label>
                <input name="categoria" defaultValue={editingProduct?.categoria} required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-white text-white font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Preço (R$)</label>
                <input name="preco" type="number" step="0.01" defaultValue={editingProduct?.preco} required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-white text-white font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Estoque Inicial</label>
                <input name="estoque" type="number" defaultValue={editingProduct?.estoque} required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-white text-white font-bold" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">URL da Imagem</label>
                <input name="imageUrl" defaultValue={editingProduct?.imageUrl} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-white text-white font-bold" placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Link do Vídeo (YouTube)</label>
                <input name="youtubeUrl" defaultValue={editingProduct?.youtubeUrl} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-white text-white font-bold" placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Descrição Técnica</label>
                <textarea name="descricaoTecnica" defaultValue={editingProduct?.descricaoTecnica} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-white text-white font-bold h-32" />
              </div>
            </div>
            <div className="flex gap-4 mt-12">
               <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 text-white/30 uppercase font-black text-xs">Cancelar</button>
               <button type="submit" disabled={isSaving} className="flex-1 bg-white text-black py-5 rounded-2xl uppercase font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                 {isSaving && <Loader2 size={16} className="animate-spin" />}
                 {editingProduct ? 'Atualizar Produto' : 'Salvar Produto'}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Cadastro de Revenda */}
      {showModal && activeTab === 'resales' && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-8">
          <form ref={resaleFormRef} onSubmit={handleSaveResale} className="bg-zinc-950 border border-white/10 rounded-[3rem] w-full max-w-lg p-12 shadow-2xl">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-10">
              {editingResale ? 'Editar Unidade' : 'Nova Unidade Revenda'}
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Nome da Unidade</label>
                <input name="nome" defaultValue={editingResale?.nome} required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-white text-white font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Cidade - UF</label>
                <input name="cidade" defaultValue={editingResale?.cidade} required placeholder="Ex: São Paulo - SP" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-white text-white font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Endereço Completo</label>
                <input name="endereco" defaultValue={editingResale?.endereco} required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-white text-white font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">Telefone de Contato</label>
                <input name="telefone" defaultValue={editingResale?.telefone} required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-white text-white font-bold" />
              </div>
            </div>
            <div className="flex gap-4 mt-12">
               <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 text-white/30 uppercase font-black text-xs">Cancelar</button>
               <button type="submit" className="flex-1 bg-white text-black py-5 rounded-2xl uppercase font-black text-xs shadow-xl active:scale-95 transition-all">
                 {editingResale ? 'Atualizar Unidade' : 'Salvar Unidade'}
               </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
