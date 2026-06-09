<?php
header('Content-Type: text/plain');
$checks = [
	'HTTP_X_FORWARDED_PROTO',
	'REDIRECT_HTTP_X_FORWARDED_PROTO',
	'HTTP_X_FORWARDED_PROTOCOL',
	'HTTP_X_FORWARDED_SSL',
	'HTTP_X_FORWARDED_SCHEME',
	'HTTP_FORWARDED',
	'REQUEST_SCHEME',
	'HTTPS',
	'SERVER_PORT',
];
foreach ($checks as $key) {
	echo $key . ': ' . ($_SERVER[$key] ?? 'missing') . "\n";
}
echo "\nDetected protocol: " . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'HTTPS' : 'HTTP') . "\n";
echo "\nAll X-Forwarded-* headers seen by PHP:\n";
$found = false;
foreach ($_SERVER as $key => $value) {
	if (strpos($key, 'HTTP_X_FORWARDED_') === 0) {
		$found = true;
		echo $key . ': ' . $value . "\n";
	}
}
if (!$found) {
	echo 'none' . "\n";
}
?>