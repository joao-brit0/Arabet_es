<?php

test('registration screen can be rendered', function () {
    $this->withoutVite();

    $response = $this->get('/cadastro');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/cadastro', [
        'name' => 'Test User',
        'cpf' => '12345678909',
        'email' => 'test@example.com',
        'password' => 'password',
        'role' => 'cliente',
    ]);

    $response->assertRedirect('/');

    $this->assertDatabaseHas('users', [
        'name' => 'Test User',
        'cpf' => '12345678909',
        'email' => 'test@example.com',
        'role' => 'cliente',
    ]);
});
