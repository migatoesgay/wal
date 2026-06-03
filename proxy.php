<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Obtener los parámetros de la URL
$pool = $_GET['pool'] ?? '';
$wallet = $_GET['wallet'] ?? '';

if (empty($pool) || empty($wallet)) {
    echo json_encode(["error" => "Faltan parámetros obligatorios."]);
    exit;
}

// Configurar la URL real según la pool solicitada
if ($pool === 'bch') {
    $url = "https://bchnode.solomining.io/api/wallet/" . urlencode($wallet);
} elseif ($pool === 'btc') {
    // URL corregida y sincronizada con stats.ckpool.org
    $url = "https://stats.ckpool.org/api/user/" . urlencode($wallet);
}

// Hacer la petición a la API real desde el servidor
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
// Evita problemas de certificados SSL en algunos servidores compartidos
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

if ($http_code === 200) {
    echo $response;
} else {
    echo json_encode(["error" => "No se pudo conectar con la pool", "code" => $http_code]);
}
?>
