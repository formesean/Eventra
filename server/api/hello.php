<?php
header("Content-Type: application/json");

$response = [
  "message" => "Hello from Eventra Backend API!",
  "time" => date("Y-m-d H:i:s")
];

echo json_encode($response);
