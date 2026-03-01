
import { Product, Resale, ResaleStock } from '../types';
import { supabase } from './supabase';

/**
 * Serviço de API integrado com Supabase.
 */
export const apiService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return (data || []).map(p => ({
      id: p.id,
      sku: p.sku,
      nome: p.nome,
      descricaoTecnica: p.descricao_tecnica,
      categoria: p.categoria,
      ncm: p.ncm,
      youtubeUrl: p.youtube_url,
      imageUrl: p.image_url,
      preco: p.preco,
      estoque: p.estoque,
      barcode: p.barcode
    }));
  },

  async saveProduct(product: Product): Promise<Product> {
    const payload = {
      sku: product.sku,
      nome: product.nome,
      descricao_tecnica: product.descricaoTecnica,
      categoria: product.categoria,
      ncm: product.ncm,
      youtube_url: product.youtubeUrl,
      image_url: product.imageUrl,
      preco: product.preco,
      estoque: product.estoque,
      barcode: product.barcode
    };

    let result;
    if (product.id && !product.id.startsWith('temp_')) {
      // Update
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      // Insert
      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    return {
      id: result.id,
      sku: result.sku,
      nome: result.nome,
      descricaoTecnica: result.descricao_tecnica,
      categoria: result.categoria,
      ncm: result.ncm,
      youtubeUrl: result.youtube_url,
      imageUrl: result.image_url,
      preco: result.preco,
      estoque: result.estoque,
      barcode: result.barcode
    };
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- Funções de Revenda ---

  async getResales(): Promise<Resale[]> {
    const { data, error } = await supabase
      .from('resales')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Error fetching resales:', error);
      return [];
    }

    return (data || []).map(r => ({
      id: r.id,
      nome: r.nome,
      endereco: r.endereco,
      cidade: r.cidade,
      telefone: r.telefone,
      lat: r.lat,
      lng: r.lng,
      login: r.login,
      password: r.password
    }));
  },

  async saveResale(resale: Resale): Promise<Resale> {
    const payload = {
      nome: resale.nome,
      endereco: resale.endereco,
      cidade: resale.cidade,
      telefone: resale.telefone,
      lat: resale.lat,
      lng: resale.lng,
      login: resale.login,
      password: resale.password
    };

    let result;
    if (resale.id && !resale.id.startsWith('temp_')) {
      const { data, error } = await supabase
        .from('resales')
        .update(payload)
        .eq('id', resale.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('resales')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    return {
      id: result.id,
      nome: result.nome,
      endereco: result.endereco,
      cidade: result.cidade,
      telefone: result.telefone,
      lat: result.lat,
      lng: result.lng,
      login: result.login,
      password: result.password
    };
  },

  async loginResale(login: string, pass: string): Promise<Resale | null> {
    const { data, error } = await supabase
      .from('resales')
      .select('*')
      .eq('login', login)
      .eq('password', pass)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      nome: data.nome,
      endereco: data.endereco,
      cidade: data.cidade,
      telefone: data.telefone,
      lat: data.lat,
      lng: data.lng,
      login: data.login,
      password: data.password
    };
  },

  async deleteResale(id: string): Promise<void> {
    const { error } = await supabase
      .from('resales')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- Funções de Estoque de Revenda ---

  async getResaleStock(): Promise<ResaleStock[]> {
    const { data, error } = await supabase
      .from('resale_stock')
      .select('*');

    if (error) {
      console.error('Error fetching resale stock:', error);
      return [];
    }

    return (data || []).map(s => ({
      resaleId: s.resale_id,
      productId: s.product_id,
      quantidade: s.quantidade
    }));
  },

  async updateResaleStock(resaleId: string, productId: string, quantidade: number): Promise<void> {
    // Upsert equivalent in Supabase
    const { error } = await supabase
      .from('resale_stock')
      .upsert({
        resale_id: resaleId,
        product_id: productId,
        quantidade: quantidade
      }, { onConflict: 'resale_id,product_id' });

    if (error) throw error;
  }
};
