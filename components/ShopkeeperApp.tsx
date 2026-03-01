
import React, { useState } from 'react';
import { Camera, ShoppingCart, Clock, Search, ChevronRight, Plus, Minus, CheckCircle2, History, X, Trash2, Box } from 'lucide-react';
import { MOCK_USER_SHOPKEEPER } from '../constants';
import { Product, CartItem, Order } from '../types';
import Scanner from './Scanner';

interface ShopkeeperAppProps {
  products: Product[];
  onLogout: () => void;
}

const ShopkeeperApp: React.FC<ShopkeeperAppProps> = ({ products, onLogout }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'home' | 'cart' | 'history'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderQuantity, setOrderQuantity] = useState(1);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    setSelectedProduct(null);
    setOrderQuantity(1);
    setIsScanning(false);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const finalizeOrder = () => {
    // Fix: Using preco instead of price
    const subtotal = cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
    const taxes = subtotal * 0.12;
    const total = subtotal + taxes;
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toLocaleDateString('pt-BR'),
      items: [...cart],
      total,
      status: 'Pendente'
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setView('history');
  };

  const handleScanSuccess = (code: string) => {
    const found = products.find(p => p.sku === code || p.barcode === code) || products[0];
    setSelectedProduct(found);
    setIsScanning(false);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col relative pb-24 overflow-x-hidden">
      {/* App Header */}
      <header className="bg-gradient-to-br from-slate-900 to-black text-white p-7 rounded-b-[3rem] shadow-2xl sticky top-0 z-40 border-b border-amber-500/20">
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Box size={20} className="text-amber-500" />
               <h1 className="text-xl font-black tracking-tight uppercase">EXFAK <span className="text-amber-500">EXPRESS</span></h1>
            </div>
            <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">{MOCK_USER_SHOPKEEPER.name}</p>
          </div>
          <button onClick={onLogout} className="text-[10px] font-black bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full border border-amber-500/20 uppercase tracking-widest active:bg-amber-500/20">Sair</button>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar por SKU ou Nome..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-12 text-sm text-white placeholder-white/40 focus:bg-white/10 focus:border-amber-500/50 outline-none transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" size={18} />
        </div>
      </header>

      {/* Main View Area */}
      <main className="p-6 flex-1">
        {view === 'home' && (
          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-[3rem] shadow-inner border border-slate-100 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-amber-200">
                <Camera size={40} />
              </div>
              <h3 className="font-black text-xl mb-2 text-slate-800 uppercase tracking-tight">Reposição Rápida</h3>
              <p className="text-sm text-slate-500 mb-8 max-w-[200px]">Escaneie códigos de prateleira para reposição imediata.</p>
              <button 
                onClick={() => setIsScanning(true)}
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-amber-200 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                <Camera size={20} />
                Abrir Scanner
              </button>
            </div>

            <section>
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                  <History size={18} className="text-amber-600" />
                  Mais Vendidos
                </h2>
                <button className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Ver Todos</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col hover:border-amber-200 transition-colors">
                    {/* Fix: Using nome instead of name */}
                    <img src={p.imageUrl} className="w-full aspect-square object-cover rounded-2xl mb-4 bg-slate-50" alt={p.nome} />
                    <p className="text-[10px] font-black text-amber-600 mb-1 uppercase tracking-widest">{p.sku}</p>
                    {/* Fix: Using nome instead of name */}
                    <p className="text-sm font-bold text-slate-800 truncate mb-1">{p.nome}</p>
                    {/* Fix: Using preco instead of price */}
                    <p className="text-slate-950 font-black text-lg mb-3">R$ {p.preco.toFixed(2)}</p>
                    <button 
                      onClick={() => setSelectedProduct(p)}
                      className="mt-auto w-full text-[10px] font-black uppercase bg-slate-50 text-slate-400 py-3 rounded-xl hover:bg-amber-600 hover:text-white transition-all tracking-widest"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === 'cart' && (
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Meu Carrinho</h2>
            {cart.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <ShoppingCart size={40} className="text-slate-200" />
                </div>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Seu carrinho está vazio.</p>
                <button onClick={() => setView('home')} className="mt-6 text-amber-600 font-black uppercase text-xs">Explorar Catálogo</button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex gap-4 items-center">
                      <img src={item.imageUrl} className="w-20 h-20 rounded-2xl object-cover bg-slate-50" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{item.sku}</p>
                        {/* Fix: Using nome instead of name */}
                        <h4 className="font-bold text-slate-800 text-sm mb-2">{item.nome}</h4>
                        <div className="flex items-center justify-between">
                          {/* Fix: Using preco instead of price */}
                          <p className="text-amber-700 font-black">R$ {(item.preco * item.quantity).toFixed(2)}</p>
                          <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-3">
                             <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 rounded-lg bg-white shadow-sm text-slate-400"><Minus size={14}/></button>
                             <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 rounded-lg bg-white shadow-sm text-amber-600"><Plus size={14}/></button>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-400 p-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 p-8 rounded-[3rem] text-white mt-10 shadow-2xl space-y-4 border border-amber-500/20">
                  <div className="flex justify-between text-xs font-bold uppercase opacity-50 tracking-widest">
                    <span>Subtotal</span>
                    {/* Fix: Using preco instead of price */}
                    <span>R$ {cart.reduce((s, i) => s + (i.preco * i.quantity), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase opacity-50 tracking-widest">
                    <span>Impostos (IPI/ST Est.)</span>
                    {/* Fix: Using preco instead of price */}
                    <span>R$ {(cart.reduce((s, i) => s + (i.preco * i.quantity), 0) * 0.12).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-2xl pt-4 border-t border-white/10">
                    <span className="uppercase tracking-tighter">Total</span>
                    {/* Fix: Using preco instead of price */}
                    <span className="text-amber-500">R$ {(cart.reduce((s, i) => s + (i.preco * i.quantity), 0) * 1.12).toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={finalizeOrder}
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-5 rounded-2xl font-black text-sm mt-6 shadow-xl uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Finalizar Pedido
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-4">
             <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Meus Pedidos</h2>
             {orders.length === 0 ? (
               <div className="text-center py-24 text-slate-300 uppercase font-black text-xs tracking-widest">Nenhum pedido realizado.</div>
             ) : (
               orders.map(order => (
                 <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] text-amber-600 font-black uppercase mb-1 tracking-widest">PEDIDO #{order.id}</p>
                        <p className="text-sm font-bold text-slate-800">{order.date}</p>
                      </div>
                      <span className="px-4 py-1.5 bg-amber-50 text-amber-700 text-[9px] font-black rounded-full uppercase tracking-widest">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex -space-x-3 mb-4 overflow-hidden">
                      {order.items.map((item, idx) => (
                        <img key={idx} src={item.imageUrl} className="w-10 h-10 rounded-full border-2 border-white object-cover bg-slate-50 shadow-sm" />
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total</span>
                      <span className="font-black text-amber-600 text-xl">R$ {order.total.toFixed(2)}</span>
                    </div>
                 </div>
               ))
             )}
          </div>
        )}
      </main>

      {/* Bottom Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 flex justify-around p-4 z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setView('home')}
          className={`flex flex-col items-center gap-1 transition-all ${view === 'home' ? 'text-amber-600' : 'text-slate-300'}`}
        >
          <Search size={22} className={view === 'home' ? 'stroke-[3]' : ''} />
          <span className="text-[9px] font-black uppercase tracking-widest">Catálogo</span>
        </button>
        <button 
          onClick={() => setIsScanning(true)}
          className="flex flex-col items-center gap-1 -mt-12"
        >
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-amber-200 border-4 border-white active:scale-90 transition-transform">
            <Camera size={28} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 mt-1">SCAN</span>
        </button>
        <button 
          onClick={() => setView('cart')}
          className={`flex flex-col items-center gap-1 transition-all ${view === 'cart' ? 'text-amber-600' : 'text-slate-300'}`}
        >
          <div className="relative">
            <ShoppingCart size={22} className={view === 'cart' ? 'stroke-[3]' : ''} />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-black">{cart.length}</span>}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Carrinho</span>
        </button>
        <button 
          onClick={() => setView('history')}
          className={`flex flex-col items-center gap-1 transition-all ${view === 'history' ? 'text-amber-600' : 'text-slate-300'}`}
        >
          <Clock size={22} className={view === 'history' ? 'stroke-[3]' : ''} />
          <span className="text-[9px] font-black uppercase tracking-widest">Pedidos</span>
        </button>
      </nav>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-[3.5rem] p-10 animate-slide-up shadow-2xl border-t-4 border-amber-500">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-1.5 bg-slate-100 rounded-full"></div>
            </div>
            
            <div className="flex gap-6 mb-8 items-center">
              <img src={selectedProduct.imageUrl} className="w-32 h-32 rounded-[2rem] object-cover shadow-xl bg-slate-50" />
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">{selectedProduct.sku}</p>
                {/* Fix: Using nome instead of name */}
                <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2 uppercase tracking-tighter">{selectedProduct.nome}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest">Disponível</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100 shadow-inner">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Especificações</p>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {/* Fix: Using descricaoTecnica instead of description */}
                {selectedProduct.descricaoTecnica}
              </p>
            </div>

            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Preço Especial</p>
                {/* Fix: Using preco instead of price */}
                <p className="text-3xl font-black text-slate-950">R$ {selectedProduct.preco.toFixed(2)}</p>
              </div>
              <div className="flex items-center bg-slate-50 rounded-2xl p-2 gap-5 shadow-inner border border-slate-100">
                <button 
                  onClick={() => setOrderQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400"
                >
                  <Minus size={20}/>
                </button>
                <span className="font-black text-xl px-2 min-w-[20px] text-center text-slate-800">{orderQuantity}</span>
                <button 
                  onClick={() => setOrderQuantity(q => q + 1)}
                  className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600"
                >
                  <Plus size={20}/>
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-5 text-slate-400 font-black text-xs uppercase tracking-widest"
              >
                Voltar
              </button>
              <button 
                onClick={() => addToCart(selectedProduct, orderQuantity)}
                className="flex-[2] bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-amber-200 active:scale-95 transition-all"
              >
                Adicionar ao Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {isScanning && <Scanner onScan={handleScanSuccess} onClose={() => setIsScanning(false)} />}
    </div>
  );
};

export default ShopkeeperApp;
