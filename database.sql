
-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS db_5maxx;
USE db_5maxx;

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id VARCHAR(50) PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    ncm VARCHAR(20),
    preco DECIMAL(10, 2),
    estoque INT DEFAULT 0,
    descricao_tecnica TEXT,
    youtube_url VARCHAR(255),
    image_url VARCHAR(255),
    barcode VARCHAR(100)
);

-- Tabela de Revendas
CREATE TABLE IF NOT EXISTS revendas (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    telefone VARCHAR(20),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8)
);

-- Tabela de Estoque por Revenda
CREATE TABLE IF NOT EXISTS estoque_revenda (
    resale_id VARCHAR(50),
    product_id VARCHAR(50),
    quantidade INT DEFAULT 0,
    PRIMARY KEY (resale_id, product_id),
    FOREIGN KEY (resale_id) REFERENCES revendas(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- Dados iniciais de exemplo
INSERT IGNORE INTO produtos (id, sku, nome, categoria, preco, image_url) VALUES 
('1', 'MAX-FELT-01', 'Bloco de Feltro Industrial', 'Feltros', 32.50, 'https://images.unsplash.com/photo-1584583011663-8f6458428876?auto=format&fit=crop&q=80&w=800'),
('2', 'MAX-CUT-ING', 'Estilete Ingenuity 5MAXX', 'Estiletes', 95.00, 'https://images.unsplash.com/photo-1590528434685-78e7343e5762?auto=format&fit=crop&q=80&w=800');
