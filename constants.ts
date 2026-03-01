
import { Product, User, UserRole, Resale, ResaleStock } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'MAX-FELT-01',
    nome: 'Bloco de Feltro Industrial',
    categoria: 'Feltros',
    descricaoTecnica: 'Feltro de lã de alta densidade, ideal para polimento e aplicação de películas sensíveis sem causar micro-riscos.',
    preco: 32.50,
    estoque: 200,
    barcode: 'MAX-FELT-01',
    ncm: '5911.90.00',
    imageUrl: 'https://images.unsplash.com/photo-1584583011663-8f6458428876?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=EQkY9_iFMTI'
  },
  {
    id: '2',
    sku: 'MAX-CUT-ING',
    nome: 'Estilete Ingenuity 5MAXX',
    categoria: 'Estiletes',
    descricaoTecnica: 'Estilete de precisão com corpo anatômico e trava automática. Desenvolvido para cortes complexos.',
    preco: 95.00,
    estoque: 85,
    barcode: 'MAX-CUT-ING',
    ncm: '8211.93.00',
    imageUrl: 'https://images.unsplash.com/photo-1590528434685-78e7343e5762?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=EQkY9_iFMTI'
  },
  {
    id: '3',
    sku: 'MAX-WRAP-BLK',
    nome: 'Espátula Wrap Black Edition',
    categoria: 'Espatulas',
    descricaoTecnica: 'Espátula premium com revestimento protetor personalizado. Deslize superior.',
    preco: 48.90,
    estoque: 120,
    barcode: 'MAX-WRAP-BLK',
    ncm: '3926.90.90',
    imageUrl: 'https://images.unsplash.com/photo-1611244419377-b0a760c18452?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=EQkY9_iFMTI'
  }
];

export const MOCK_RESALES: Resale[] = [
  {
    id: 'r1',
    nome: '5MAXX São Paulo Central',
    endereco: 'Av. Paulista, 1000',
    cidade: 'São Paulo - SP',
    telefone: '(11) 98888-7777',
    lat: -23.5614,
    lng: -46.6559
  },
  {
    id: 'r2',
    nome: 'Premium Wraps Curitiba',
    endereco: 'Rua das Flores, 450',
    cidade: 'Curitiba - PR',
    telefone: '(41) 3333-2222',
    lat: -25.4290,
    lng: -49.2671
  }
];

export const MOCK_RESALE_STOCK: ResaleStock[] = [
  { resaleId: 'r1', productId: '1', quantidade: 45 },
  { resaleId: 'r1', productId: '2', quantidade: 12 },
  { resaleId: 'r1', productId: '3', quantidade: 88 },
  { resaleId: 'r2', productId: '1', quantidade: 5 },
  { resaleId: 'r2', productId: '3', quantidade: 21 }
];

export const MOCK_USER_SHOPKEEPER: User = {
  id: 'u1',
  cnpj: '12.345.678/0001-99',
  name: 'Lojista 5MAXX',
  role: UserRole.SHOPKEEPER,
  priceTableId: 'pt-1'
};
