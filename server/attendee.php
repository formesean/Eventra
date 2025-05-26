<?php

error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,PUT');
header('Access-Control-Allow-Headers: Content-Type, Accept');

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  // Check if eventId is provided
  if (!isset($_GET['eventId'])) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'error' => 'Missing required parameter: eventId'
    ]);
    exit;
  }

  try {
    $query = $pdo->prepare("
      SELECT
        id,
        fullName as name,
        email,
        status,
        createdAt as rsvpDate,
        updatedAt as lastUpdated,
        contactNumber
      FROM registration
      WHERE eventId = :eventId
      ORDER BY createdAt DESC
    ");

    $query->execute([':eventId' => $_GET['eventId']]);
    $attendees = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
      'success' => true,
      'attendees' => $attendees
    ]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      'success' => false,
      'error' => 'Database error: ' . $e->getMessage()
    ]);
  } catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
      'success' => false,
      'error' => 'Server error: ' . $e->getMessage()
    ]);
  }
} elseif ($method === 'PUT') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (!isset($data['registrationId']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'error' => 'Missing required fields: registrationId and status'
    ]);
    exit;
  }

  try {
    $pdo->beginTransaction();

    // Get current registration status
    $currentStatusQuery = $pdo->prepare("
      SELECT status, eventId
      FROM registration
      WHERE id = :registrationId
    ");
    $currentStatusQuery->execute([':registrationId' => $data['registrationId']]);
    $currentRegistration = $currentStatusQuery->fetch(PDO::FETCH_ASSOC);

    if (!$currentRegistration) {
      throw new Exception('Registration not found');
    }

    $oldStatus = $currentRegistration['status'];
    $newStatus = $data['status'];
    $eventId = $currentRegistration['eventId'];

    // Map status values to database column names
    $statusColumnMap = [
      'going' => 'goingCount',
      'maybe' => 'maybeCount',
      'not-going' => 'notGoingCount'
    ];

    // Update registration status
    $updateQuery = $pdo->prepare("
      UPDATE registration
      SET status = :status, updatedAt = NOW()
      WHERE id = :registrationId
    ");
    $updateQuery->execute([
      ':status' => $newStatus,
      ':registrationId' => $data['registrationId']
    ]);

    // Update event counts
    // First, decrease the count for the old status
    $decreaseQuery = $pdo->prepare("
      UPDATE event
      SET {$statusColumnMap[$oldStatus]} = {$statusColumnMap[$oldStatus]} - 1
      WHERE id = :eventId
    ");
    $decreaseQuery->execute([':eventId' => $eventId]);

    // Then, increase the count for the new status
    $increaseQuery = $pdo->prepare("
      UPDATE event
      SET {$statusColumnMap[$newStatus]} = {$statusColumnMap[$newStatus]} + 1
      WHERE id = :eventId
    ");
    $increaseQuery->execute([':eventId' => $eventId]);

    $pdo->commit();

    echo json_encode([
      'success' => true,
      'message' => 'Status updated successfully'
    ]);
  } catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
      'success' => false,
      'error' => 'Failed to update status: ' . $e->getMessage()
    ]);
  }
} else {
  http_response_code(405);
  echo json_encode([
    'success' => false,
    'error' => 'Method not allowed'
  ]);
}
