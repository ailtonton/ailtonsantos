<?php
// Desativar exibição de erros para não corromper o JSON
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Tratar requisições OPTIONS (pre-flight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configurações do Banco de Dados
$host = "localhost";
$db_name = "db_5maxx";
$username = "root";
$password = ""; // Insira sua senha do MySQL

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["error" => "Erro de conexão: " . $exception->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';

// Função auxiliar para ler JSON do body
function getJsonInput() {
    $json = file_get_contents("php://input");
    return json_decode($json);
}

try {
    switch($action) {
        case 'get_products':
            $stmt = $conn->prepare("SELECT * FROM produtos ORDER BY nome ASC");
            $stmt->execute();
            echo json_encode($stmt->fetchAll());
            break;

        case 'save_product':
            $data = getJsonInput();
            if (!$data) throw new Exception("Dados inválidos");
            
            $stmt = $conn->prepare("REPLACE INTO produtos (id, sku, nome, categoria, ncm, preco, estoque, descricao_tecnica, youtube_url, image_url, barcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data->id ?? null,
                $data->sku ?? '',
                $data->nome ?? '',
                $data->categoria ?? '',
                $data->ncm ?? '',
                $data->preco ?? 0,
                $data->estoque ?? 0,
                $data->descricaoTecnica ?? '',
                $data->youtubeUrl ?? '',
                $data->imageUrl ?? '',
                $data->barcode ?? ''
            ]);
            echo json_encode(["status" => "success", "id" => $data->id]);
            break;

        case 'delete_product':
            $id = $_GET['id'] ?? '';
            $stmt = $conn->prepare("DELETE FROM produtos WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "deleted"]);
            break;

        case 'get_resales':
            $stmt = $conn->prepare("SELECT * FROM revendas ORDER BY nome ASC");
            $stmt->execute();
            echo json_encode($stmt->fetchAll());
            break;

        case 'save_resale':
            $data = getJsonInput();
            if (!$data) throw new Exception("Dados inválidos");
            
            $stmt = $conn->prepare("REPLACE INTO revendas (id, nome, endereco, cidade, telefone, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data->id ?? null,
                $data->nome ?? '',
                $data->endereco ?? '',
                $data->cidade ?? '',
                $data->telefone ?? '',
                $data->lat ?? 0,
                $data->lng ?? 0
            ]);
            echo json_encode(["status" => "success"]);
            break;

        case 'delete_resale':
            $id = $_GET['id'] ?? '';
            $stmt = $conn->prepare("DELETE FROM revendas WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "deleted"]);
            break;

        case 'get_stock':
            $stmt = $conn->prepare("SELECT resale_id as resaleId, product_id as productId, quantidade FROM estoque_revenda");
            $stmt->execute();
            echo json_encode($stmt->fetchAll());
            break;

        case 'update_stock':
            $data = getJsonInput();
            if (!$data) throw new Exception("Dados inválidos");
            
            $stmt = $conn->prepare("REPLACE INTO estoque_revenda (resale_id, product_id, quantidade) VALUES (?, ?, ?)");
            $stmt->execute([
                $data->resaleId ?? '',
                $data->productId ?? '',
                $data->quantidade ?? 0
            ]);
            echo json_encode(["status" => "success"]);
            break;

        default:
            http_response_code(400);
            echo json_encode(["error" => "Ação inválida: " . $action]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
