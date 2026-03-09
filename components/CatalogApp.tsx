
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Camera, Search, X, Info, ChevronRight, Box, Menu, LayoutGrid, Layers, Scissors, Tag, Sparkles, Loader2, RefreshCw, Download, Trophy, CheckCircle2, AlertCircle, HelpCircle, MapPin, Store, Phone, LogOut, Brain, RefreshCcw, XCircle, Share2 } from 'lucide-react';
import { Product, Resale, ResaleStock } from '../types';
import { apiService } from '../services/apiService';
import Scanner from './Scanner';

const QUIZ_QUESTIONS = [
  {
    question: "Qual a temperatura ideal do soprador térmico para a 'quebra de memória' do vinil cast?",
    options: ["50°C", "90°C a 100°C", "150°C", "200°C"],
    correct: 1
  },
  {
    question: "Qual ferramenta é essencial para garantir a adesão em canaletas profundas e evitar o efeito 'ponte'?",
    options: ["Espátula de feltro", "Rolete de pressão (moldador)", "Estilete 45°", "Imã de neodímio"],
    correct: 1
  },
  {
    question: "O que significa o termo 'Outgassing' em comunicação visual?",
    options: ["Secagem rápida da tinta UV", "Liberação de gases do solvente após impressão", "Limpeza química do substrato", "Aplicação de verniz protetor"],
    correct: 1
  },
  {
    question: "Qual o ângulo ideal da lâmina do estilete para cortes de precisão em envelopamento automotivo?",
    options: ["45 graus", "60 graus", "30 graus", "90 graus"],
    correct: 2
  },
  {
    question: "Para que serve o Primer 94 em aplicações de vinil adesivo?",
    options: ["Limpar a superfície", "Aumentar a adesão em bordas e áreas críticas", "Remover resíduos de cola antiga", "Dar brilho final ao material"],
    correct: 1
  },
  {
    question: "Qual a principal vantagem do vinil Cast sobre o Calandrado?",
    options: ["É mais barato", "Não possui memória elástica e é altamente moldável", "É mais espesso e resistente a rasgos", "Seca mais rápido após a impressão"],
    correct: 1
  },
  {
    question: "O que é o 'Post-Heating' no processo de envelopamento?",
    options: ["Aquecer o material antes de aplicar", "Aquecer o material após a aplicação para fixar a nova forma", "Secar o veículo após a lavagem técnica", "Remover bolhas com agulha quente"],
    correct: 1
  },
  {
    question: "Qual produto é o mais recomendado para a descontaminação final antes da aplicação?",
    options: ["Detergente neutro", "Álcool Isopropílico 70% ou 99%", "Querosene", "Solvente de limpeza de cabeças"],
    correct: 1
  },
  {
    question: "Em um painel de ACM, qual a ferramenta correta para realizar o vinco de dobra?",
    options: ["Estilete de precisão", "Fresa em 'V' ou Tupia", "Tesoura de chapa", "Dobradora térmica"],
    correct: 1
  },
  {
    question: "O que é o 'Silvering' em um processo de laminação a frio?",
    options: ["Efeito metalizado no acabamento", "Pequenas bolhas de ar presas que parecem pontos prateados", "Desbotamento precoce da cor", "Acúmulo de estática no material"],
    correct: 1
  }
];

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

  // Quiz State
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userName, setUserName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);

  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Background
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 297, 210, 'F');

    // Border
    doc.setDrawColor(175, 145, 93); // Gold (#af915d)
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    doc.setLineWidth(0.5);
    doc.rect(13, 13, 271, 184);

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(30);
    doc.text('CERTIFICADO DE EXCELÊNCIA', 148.5, 45, { align: 'center' });

    doc.setDrawColor(175, 145, 93);
    doc.line(80, 52, 217, 52);

    // Body text
    doc.setFontSize(16);
    doc.text('Certificamos que o profissional abaixo demonstrou competência técnica', 148.5, 75, { align: 'center' });
    doc.text('e excelência na aplicação de envelopamento automotivo.', 148.5, 83, { align: 'center' });

    // Name
    doc.setTextColor(175, 145, 93);
    doc.setFontSize(32);
    doc.text(userName.toUpperCase(), 148.5, 105, { align: 'center' });

    // Title conferred
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('Conferimos, portanto, o título de', 148.5, 125, { align: 'center' });

    doc.setTextColor(175, 145, 93);
    doc.setFontSize(36);
    doc.text('MESTRE ENVELOPADOR', 148.5, 145, { align: 'center' });

    // Recognition
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('Em reconhecimento à sua habilidade e alto padrão de qualidade.', 148.5, 165, { align: 'center' });

    // Footer
    doc.setFontSize(10);
    doc.text('5MAXX - ' + new Date().toLocaleDateString('pt-BR'), 148.5, 185, { align: 'center' });

    doc.save(`Certificado_5MAXX_${userName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === QUIZ_QUESTIONS[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizStarted(false);
  };

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

  const handleShare = async (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareData = {
      title: `5MAXX - ${product.nome}`,
      text: `Confira o produto ${product.nome} (${product.sku}) no catálogo 5MAXX!`,
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Link copiado para a área de transferência!');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Erro ao compartilhar:', err);
      }
    }
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
              <img src="https://i.ibb.co/yBXgVXNR/logo.png" alt="5MAXX" className="h-8 object-contain" referrerPolicy="no-referrer" />
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
             <img src="https://i.ibb.co/yBXgVXNR/logo.png" alt="5MAXX" className="h-10 object-contain" referrerPolicy="no-referrer" />
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
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-500">
                      <span className="text-[9px] font-black uppercase tracking-widest">Detalhes Técnicos</span>
                      <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    <button 
                      onClick={(e) => handleShare(p, e)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
                    >
                      <Share2 size={14} />
                    </button>
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

        {/* Quiz Banner */}
        <div className="mt-12 mb-8">
          <button 
            onClick={() => { setShowQuiz(true); resetQuiz(); }}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 p-8 rounded-[2.5rem] flex items-center justify-between group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="text-black" size={20} />
                <span className="text-[10px] font-black text-black/60 uppercase tracking-widest">Desafio 5MAXX</span>
              </div>
              <h3 className="text-2xl font-black italic text-black uppercase tracking-tighter leading-none">Teste seu Conhecimento</h3>
              <p className="text-black/60 text-[9px] font-bold uppercase tracking-widest mt-2">Envelopamento & Ferramentas</p>
            </div>
            <div className="bg-black w-12 h-12 rounded-2xl flex items-center justify-center group-hover:translate-x-1 transition-transform relative z-10">
              <ChevronRight className="text-amber-500" size={24} />
            </div>
          </button>
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
                       <a 
                         href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.nome}, ${r.endereco}, ${r.cidade}`)}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex-1 bg-amber-500 text-black p-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase shadow-lg shadow-amber-500/10 hover:scale-105 transition-all"
                       >
                          <MapPin size={16} /> Rota
                       </a>
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
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[110] flex items-end justify-center">
          <div className="bg-zinc-950 w-full max-w-md rounded-t-[3.5rem] p-10 animate-slide-up shadow-2xl border-t border-white/10 overflow-y-auto max-h-[95vh]">
            <div className="flex justify-center mb-8"><div className="w-16 h-1 bg-white/10 rounded-full"></div></div>
            <div className="flex gap-6 mb-10">
              <img src={selectedProduct.imageUrl} className="w-28 h-28 rounded-3xl object-cover border border-white/10" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-[9px] font-black text-white/40 uppercase mb-2">{selectedProduct.sku}</p>
                  <button 
                    onClick={() => handleShare(selectedProduct)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
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

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black z-[300] flex flex-col">
          <header className="p-8 flex justify-between items-center border-b border-white/10">
            <div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Expert Quiz</h3>
              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Questão {currentQuestion + 1} de {QUIZ_QUESTIONS.length}</p>
            </div>
            <button onClick={() => setShowQuiz(false)} className="text-white/40 hover:text-white"><X size={28} /></button>
          </header>

          <main className="flex-1 p-8 flex flex-col justify-center max-w-sm mx-auto w-full">
            {!quizStarted ? (
              <div className="animate-fade-in text-center">
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/20">
                  <Brain size={40} className="text-amber-500" />
                </div>
                <h2 className="text-3xl font-black italic uppercase text-white mb-4">Identifique-se</h2>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Para gerar seu certificado ao final</p>
                
                <div className="space-y-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Seu Nome Completo"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-amber-500 transition-all text-center"
                    />
                  </div>
                  
                  <button 
                    onClick={() => userName.trim() && setQuizStarted(true)}
                    disabled={!userName.trim()}
                    className="w-full bg-amber-500 disabled:opacity-30 text-black py-6 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                  >
                    Começar Desafio
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ) : !quizFinished ? (
              <div className="animate-fade-in">
                <div className="mb-10">
                  <h2 className="text-2xl font-black italic uppercase leading-tight text-white mb-8">
                    {QUIZ_QUESTIONS[currentQuestion].question}
                  </h2>
                  <div className="space-y-4">
                    {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => {
                      let btnClass = "w-full p-6 rounded-3xl border text-left transition-all flex justify-between items-center ";
                      if (!isAnswered) {
                        btnClass += "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10";
                      } else {
                        if (idx === QUIZ_QUESTIONS[currentQuestion].correct) {
                          btnClass += "border-emerald-500 bg-emerald-500/10 text-emerald-500";
                        } else if (idx === selectedOption) {
                          btnClass += "border-red-500 bg-red-500/10 text-red-500";
                        } else {
                          btnClass += "border-white/5 bg-white/5 opacity-40";
                        }
                      }

                      return (
                        <button 
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          disabled={isAnswered}
                          className={btnClass}
                        >
                          <span className="text-xs font-bold uppercase tracking-wide">{option}</span>
                          {isAnswered && idx === QUIZ_QUESTIONS[currentQuestion].correct && <CheckCircle2 size={18} />}
                          {isAnswered && idx === selectedOption && idx !== QUIZ_QUESTIONS[currentQuestion].correct && <XCircle size={18} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isAnswered && (
                  <button 
                    onClick={nextQuestion}
                    className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 animate-slide-up"
                  >
                    {currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'Ver Resultado' : 'Próxima Questão'}
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center animate-scale-in">
                <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/30">
                  <Trophy size={48} className="text-amber-500" />
                </div>
                <h2 className="text-4xl font-black italic uppercase text-white mb-2">Resultado Final</h2>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Sua pontuação no teste</p>
                
                <div className="text-7xl font-black italic text-white mb-4">
                  {score}<span className="text-2xl text-white/20">/{QUIZ_QUESTIONS.length}</span>
                </div>
                
                <p className="text-white/60 text-sm mb-12 px-6">
                  {score >= 8 ? "Parabéns! Você é um verdadeiro mestre do envelopamento." : 
                   score >= 5 ? "Bom trabalho! Você tem um bom conhecimento técnico." : 
                   "Continue estudando! O mercado de comunicação visual exige precisão."}
                </p>

                <div className="space-y-4">
                  {score >= 8 && (
                    <button 
                      onClick={generateCertificate}
                      className="w-full bg-amber-500 text-black py-6 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20"
                    >
                      <Download size={18} /> Baixar Certificado
                    </button>
                  )}
                  <button 
                    onClick={resetQuiz}
                    className="w-full bg-white/5 border border-white/10 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3"
                  >
                    <RefreshCcw size={18} /> Tentar Novamente
                  </button>
                  <button 
                    onClick={() => setShowQuiz(false)}
                    className="w-full py-4 text-white/30 font-black uppercase text-[10px] tracking-widest"
                  >
                    Voltar ao Catálogo
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default CatalogApp;
