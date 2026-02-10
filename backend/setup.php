<?php
$users = [
    'admin' => password_hash('password123', PASSWORD_DEFAULT)
];
file_put_contents('data/users.json', json_encode($users));
echo "Users created.\n";

if (!file_exists('data/content.json')) {
    echo "Content JSON missing!\n";
} else {
    echo "Content JSON found.\n";
}
