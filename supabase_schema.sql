
-- Supabase Schema for 5MAXX

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  descricao_tecnica TEXT,
  categoria TEXT NOT NULL,
  ncm TEXT,
  youtube_url TEXT,
  image_url TEXT,
  preco DECIMAL(10, 2) DEFAULT 0,
  estoque INTEGER DEFAULT 0,
  barcode TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Resales Table
CREATE TABLE IF NOT EXISTS resales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  endereco TEXT NOT NULL,
  cidade TEXT NOT NULL,
  telefone TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  login TEXT UNIQUE,
  password TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Resale Stock Table
CREATE TABLE IF NOT EXISTS resale_stock (
  resale_id UUID REFERENCES resales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantidade INTEGER DEFAULT 0,
  PRIMARY KEY (resale_id, product_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE resales ENABLE ROW LEVEL SECURITY;
ALTER TABLE resale_stock ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow public read for now, authenticated write)
-- Note: In a real app, you'd restrict this more.

-- Products
CREATE POLICY "Allow public read on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on products" ON products FOR DELETE USING (true);

-- Resales
CREATE POLICY "Allow public read on resales" ON resales FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on resales" ON resales FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on resales" ON resales FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on resales" ON resales FOR DELETE USING (true);

-- Resale Stock
CREATE POLICY "Allow public read on resale_stock" ON resale_stock FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on resale_stock" ON resale_stock FOR ALL USING (true);
