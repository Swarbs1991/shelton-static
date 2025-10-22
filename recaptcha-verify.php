<?php
// Server-side handler for form + reCAPTCHA v2 checkbox
// Loads secret from environment or a protected file outside webroot (/etc/shelton/recaptcha_secret)

declare(strict_types=1);

$recaptcha_secret = getenv('RECAPTCHA_SECRET') ?: null;
if (empty($recaptcha_secret)) {
    $secret_file = '/etc/shelton/G-reCAPTCHA-key';
    if (is_readable($secret_file)) {
        $recaptcha_secret = trim(file_get_contents($secret_file));
    }
}

if (empty($recaptcha_secret)) {
    http_response_code(500);
    error_log('reCAPTCHA secret missing on server');
    echo 'Server misconfiguration. Please try again later.';
    exit;
}

$recaptcha_response = $_POST['g-recaptcha-response'] ?? '';
if (empty($recaptcha_response)) {
    http_response_code(400);
    echo 'reCAPTCHA response missing. Please complete the CAPTCHA.';
    exit;
}

/* Verify reCAPTCHA with Google */
$verify_url = 'https://www.google.com/recaptcha/api/siteverify';
$postdata = http_build_query([
    'secret'   => $recaptcha_secret,
    'response' => $recaptcha_response,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
]);

$options = [
    'http' => [
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => $postdata,
        'timeout' => 10,
    ],
];

$context = stream_context_create($options);
$result = @file_get_contents($verify_url, false, $context);
if ($result === false) {
    http_response_code(502);
    error_log('reCAPTCHA verification request failed');
    echo 'Could not verify reCAPTCHA. Try again later.';
    exit;
}

$decoded = json_decode($result, true);
if (empty($decoded) || empty($decoded['success'])) {
    http_response_code(403);
    echo 'reCAPTCHA verification failed. Please try again.';
    exit;
}

/* reCAPTCHA passed — process form fields (basic sanitise) */
$name      = trim((string)($_POST['name'] ?? ''));
$email     = trim((string)($_POST['email'] ?? ''));
$eventType = trim((string)($_POST['event-type'] ?? ''));
$date      = trim((string)($_POST['date'] ?? ''));
$message   = trim((string)($_POST['message'] ?? ''));

/* Basic validation */
if ($name === '' || $email === '') {
    http_response_code(400);
    echo 'Name and email are required.';
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Invalid email address.';
    exit;
}

/* Prepare email (adjust recipient as needed) */
$to      = 'vraptor1991@hotmail.com';
$subject = 'Booking request from website';
$body    = "Name: {$name}\nEmail: {$email}\nEvent Type: {$eventType}\nDate: {$date}\n\nMessage:\n{$message}\n";
$headers = "From: {$name} <{$email}>\r\nReply-To: {$email}\r\n";

/* Send mail (may require server mail configured) */
@mail($to, $subject, $body, $headers);

/* On success, just echo a success message */
http_response_code(200);
echo 'success';
exit;
?>