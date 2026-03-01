
import { Product, Resale, ResaleStock } from '../types';
import { MOCK_PRODUCTS, MOCK_RESALES, MOCK_RESALE_STOCK } from '../constants';

const DB_KEY = '5maxx_local_db';
const RESALE_KEY = '5maxx_resales';
const STOCK_KEY = '5maxx_resale_stock';

/**
 * Serviço de API simulado com localStorage para persistência offline.
 */
export const apiService = {
  async getProducts(): Promise<Product[]> {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) return JSON.parse(saved);
    // Inicializa com dados fake se estiver vazio
    localStorage.setItem(DB_KEY, JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  },

  async saveProduct(product: Product): Promise<Product> {
    const products = await this.getProducts();
    const clean = { ...product };
    if (clean.id.startsWith('temp_')) {
      clean.id = Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    const idx = products.findIndex(p => p.id === clean.id);
    const updated = idx >= 0 ? products.map(p => p.id === clean.id ? clean : p) : [clean, ...products];
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    return clean;
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    localStorage.setItem(DB_KEY, JSON.stringify(products.filter(p => p.id !== id)));
  },

  // --- Funções de Revenda (Persistência Local) ---

  async getResales(): Promise<Resale[]> {
    const saved = localStorage.getItem(RESALE_KEY);
    if (saved) return JSON.parse(saved);
    localStorage.setItem(RESALE_KEY, JSON.stringify(MOCK_RESALES));
    return MOCK_RESALES;
  },

  async saveResale(resale: Resale): Promise<Resale> {
    const resales = await this.getResales();
    const clean = { ...resale };
    if (clean.id.startsWith('temp_')) {
      clean.id = `RES_${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    }
    const idx = resales.findIndex(r => r.id === clean.id);
    const updated = idx >= 0 ? resales.map(r => r.id === clean.id ? clean : r) : [clean, ...resales];
    localStorage.setItem(RESALE_KEY, JSON.stringify(updated));
    return clean;
  },

  async deleteResale(id: string): Promise<void> {
    const resales = await this.getResales();
    localStorage.setItem(RESALE_KEY, JSON.stringify(resales.filter(r => r.id !== id)));
  },

  // --- Funções de Estoque de Revenda (Persistência Local) ---

  async getResaleStock(): Promise<ResaleStock[]> {
    const saved = localStorage.getItem(STOCK_KEY);
    if (saved) return JSON.parse(saved);
    localStorage.setItem(STOCK_KEY, JSON.stringify(MOCK_RESALE_STOCK));
    return MOCK_RESALE_STOCK;
  },

  async updateResaleStock(resaleId: string, productId: string, quantidade: number): Promise<void> {
    const stocks = await this.getResaleStock();
    const idx = stocks.findIndex(s => s.resaleId === resaleId && s.productId === productId);
    let updated;
    if (idx >= 0) {
      updated = stocks.map((s, i) => i === idx ? { ...s, quantidade } : s);
    } else {
      updated = [...stocks, { resaleId, productId, quantidade }];
    }
    localStorage.setItem(STOCK_KEY, JSON.stringify(updated));
  }
};
