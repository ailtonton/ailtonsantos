
import React, { useState, useEffect } from 'react';
import { Product, Resale, ResaleStock } from '../types';
import { apiService } from '../services/apiService';
import { Box, LogOut, Package, Hash, Save, Loader2, CheckCircle2 } from 'lucide-react';

interface ResaleDashboardProps {
  resale: Resale;
  products: Product[];
  onLogout: () => void;
}

const ResaleDashboard: React.FC<ResaleDashboardProps> = ({ resale, products, onLogout }) => {
  const [resaleStock, setResaleStock] = useState<ResaleStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadStock = async () => {
      try {
        const stock = await apiService.getResaleStock();
        setResaleStock(stock.filter(s => s.resaleId === resale.id));
      } catch (error) {
        console.error("Erro ao carregar estoque:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStock();
  }, [resale.id]);

  const handleUpdateStock = async (productId: string, qty: number) => {
    setIsSaving(productId);
    try {
      await apiService.updateResaleStock(resale.id, productId, qty);
      setResaleStock(prev => {
        const idx = prev.findIndex(s => s.productId === productId);
        if (idx >= 0) return prev.map(s => s.productId === productId ? { ...s, quantidade: qty } : s);
        return [...prev, { resaleId: resale.id, productId, quantidade: qty }];
      });
      setSavedSuccess(productId);
      setTimeout(() => setSavedSuccess(null), 2000);
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      alert("Erro ao salvar estoque.");
    } finally {
      setIsSaving(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-white/40 text-xs font-black uppercase tracking-widest">Carregando Inventário...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      <header className="bg-black border-b border-white/10 p-8 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Package className="text-amber-500" size={24} />
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">Painel de Revenda</h1>
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">{resale.nome}</p>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-4">Gestão de Estoque</h2>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Atualize a disponibilidade dos produtos em sua unidade</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map(p => {
            const stock = resaleStock.find(s => s.productId === p.id);
            return (
              <div key={p.id} className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 flex items-center gap-6 hover:bg-zinc-900 transition-all group">
                <img src={p.imageUrl} className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
                <div className="flex-1">
                  <p className="text-[9px] font-black text-white/30 uppercase mb-1 tracking-widest">{p.sku}</p>
                  <h4 className="text-lg font-black italic uppercase text-white truncate mb-4">{p.nome}</h4>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
                      <input 
                        type="number" 
                        defaultValue={stock?.quantidade || 0}
                        onBlur={(e) => handleUpdateStock(p.id, parseInt(e.target.value) || 0)}
                        className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-black text-amber-500 outline-none focus:border-amber-500 transition-all"
                      />
                    </div>
                    <div className="w-10 flex items-center justify-center">
                      {isSaving === p.id ? (
                        <Loader2 size={20} className="text-amber-500 animate-spin" />
                      ) : savedSuccess === p.id ? (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="p-8 border-t border-white/5 text-center">
        <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.4em]">© 2024 5MAXX - Sistema de Gestão de Revendas</p>
      </footer>
    </div>
  );
};

export default ResaleDashboard;
