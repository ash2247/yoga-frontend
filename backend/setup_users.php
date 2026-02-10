<?php
$users = [
    'admin' => password_hash('password123', PASSWORD_DEFAULT)
];
file_put_contents(__DIR__ . '/data/users.json', json_encode($users));
echo "Users created at " . __DIR__ . "/data/users.json\n";
