<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('login page loads', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->has('canResetPassword')
            ->has('canRegister')
        );
});

test('register page loads', function () {
    $this->get(route('register'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/register')
        );
});

test('two factor challenge page loads', function () {
    $user = User::factory()->create();

    $this->withSession(['login.id' => (string) $user->id, 'login.remember' => false])
        ->get(route('two-factor.login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/two-factor-challenge')
        );
});
