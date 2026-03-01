
import React, { useState, useEffect } from 'react';
import { UserRole, Product } from './types';
import CatalogApp from './components/CatalogApp';
import AdminDashboard from './components/AdminDashboard';
import ResaleDashboard from './components/ResaleDashboard';
import { apiService } from './services/apiService';
import { ShieldCheck, ArrowRight, Loader2, Cpu, X, Store } from 'lucide-react';
import { Resale } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isResaleMode, setIsResaleMode] = useState(false);
  const [currentResale, setCurrentResale] = useState<Resale | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'resale'>('admin');
  const [adminCredentials, setAdminCredentials] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState(false);

  // Sincronização inicial com o Banco de Dados Local
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Falha ao carregar catálogo:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginType === 'admin') {
      if (adminCredentials.user === 'admin' && adminCredentials.pass === '5maxx2024') {
        setIsAdminMode(true);
        setIsLoggedIn(true);
        setShowAdminLogin(false);
        setLoginError(false);
      } else {
        setLoginError(true);
      }
    } else {
      const resale = await apiService.loginResale(adminCredentials.user, adminCredentials.pass);
      if (resale) {
        setCurrentResale(resale);
        setIsResaleMode(true);
        setIsLoggedIn(true);
        setShowAdminLogin(false);
        setLoginError(false);
      } else {
        setLoginError(true);
      }
    }
  };

  const enterCatalog = () => {
    setIsAdminMode(false);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminMode(false);
    setIsResaleMode(false);
    setCurrentResale(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full animate-pulse"></div>
           <Loader2 className="w-16 h-16 text-white animate-spin stroke-[1.5]" />
        </div>
        <div className="flex items-center gap-3 text-white/40 animate-pulse">
           <Cpu size={16} />
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">Carregando Catálogo 5MAXX...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-zinc-800/20 blur-[120px] rounded-full"></div>

        <div className="w-full max-w-lg text-center z-10 space-y-12">
          <div className="flex flex-col items-center">
            <div className="mb-4">
               <h1 className="text-7xl font-black italic tracking-tighter text-white">5MAXX</h1>
               <p className="text-white text-sm font-light tracking-[0.4em] uppercase mt-[-0.5rem] bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-700 bg-clip-text text-transparent">Innovating Beyond</p>
            </div>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50 mt-6"></div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center gap-2">
               <h2 className="text-white/60 text-lg font-medium tracking-wide">Plataforma Institucional de Soluções</h2>
               <div className="flex items-center gap-2 text-[8px] text-zinc-500/50 font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-pulse"></div>
                  Database Offline Simulation
               </div>
            </div>
            
            <button 
              onClick={enterCatalog}
              className="group w-full bg-white text-black font-black py-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              Explorar Catálogo
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => setShowAdminLogin(true)}
              className="w-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
            >
              <ShieldCheck size={18} />
              Acesso Restrito
            </button>
          </div>
        </div>

        {/* Modal de Login Admin */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
              
              <button 
                onClick={() => { setShowAdminLogin(false); setLoginError(false); }}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <ShieldCheck size={48} className="text-amber-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Acesso Restrito</h3>
                <div className="flex bg-white/5 p-1 rounded-xl mt-6 border border-white/10">
                  <button 
                    onClick={() => { setLoginType('admin'); setLoginError(false); }}
                    className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${loginType === 'admin' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                  >
                    Administrador
                  </button>
                  <button 
                    onClick={() => { setLoginType('resale'); setLoginError(false); }}
                    className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${loginType === 'resale' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                  >
                    Revenda
                  </button>
                </div>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Usuário"
                    value={adminCredentials.user}
                    onChange={(e) => setAdminCredentials(prev => ({ ...prev, user: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 outline-none focus:border-amber-500 transition-all font-bold"
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    placeholder="Senha"
                    value={adminCredentials.pass}
                    onChange={(e) => setAdminCredentials(prev => ({ ...prev, pass: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 outline-none focus:border-amber-500 transition-all font-bold"
                  />
                </div>
                
                {loginError && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">Credenciais Inválidas</p>
                )}

                <button 
                  type="submit"
                  className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5"
                >
                  Entrar no Sistema
                </button>
              </form>
            </div>
          </div>
        )}

        <p className="absolute bottom-8 text-[#cccccc] text-[10px] uppercase tracking-[0.2em] font-bold text-center w-full px-6">
          © 2024 5MAXX - All Rights Reserved - Criado por AIlton Santos
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {isAdminMode ? (
        <AdminDashboard 
          products={products} 
          setProducts={setProducts} 
          onLogout={handleLogout} 
        />
      ) : isResaleMode && currentResale ? (
        <ResaleDashboard 
          resale={currentResale}
          products={products}
          onLogout={handleLogout}
        />
      ) : (
        <CatalogApp 
          products={products}
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default App;
