
export enum UserRole {
  SHOPKEEPER = 'SHOPKEEPER',
  ADMIN = 'ADMIN'
}

export interface Product {
  id: string;
  sku: string;
  nome: string;
  descricaoTecnica: string;
  categoria: string;
  ncm: string;
  youtubeUrl?: string;
  imageUrl: string;
  preco: number;
  estoque: number;
  barcode: string;
  imagem?: File;
}

export interface Resale {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  telefone: string;
  lat: number;
  lng: number;
}

export interface ResaleStock {
  resaleId: string;
  productId: string;
  quantidade: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pendente' | 'Faturado' | 'Enviado';
}

export interface User {
  id: string;
  cnpj: string;
  name: string;
  role: UserRole;
  priceTableId: string;
}
