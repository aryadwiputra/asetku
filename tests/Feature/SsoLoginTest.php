<?php

use App\Models\User;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;

test('sso callback logs in an existing user and links identity', function () {
    $user = User::factory()->create([
        'email' => 'jane@example.com',
        'email_verified_at' => now(),
        'is_active' => true,
    ]);

    $socialUser = new class implements SocialiteUser {
        public array $user = ['email_verified' => true];

        public function getId()
        {
            return 'google-user-123';
        }

        public function getNickname()
        {
            return null;
        }

        public function getName()
        {
            return 'Jane';
        }

        public function getEmail()
        {
            return 'jane@example.com';
        }

        public function getAvatar()
        {
            return null;
        }
    };

    $driver = Mockery::mock();
    $driver->shouldReceive('user')->once()->andReturn($socialUser);

    Socialite::shouldReceive('driver')->with('google')->once()->andReturn($driver);

    $this->get(route('sso.callback', ['provider' => 'google']))
        ->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);

    $this->assertDatabaseHas('user_identities', [
        'user_id' => $user->id,
        'provider' => 'google',
        'provider_user_id' => 'google-user-123',
        'email' => 'jane@example.com',
    ]);

    $this->assertDatabaseHas('user_login_events', [
        'user_id' => $user->id,
        'event' => 'login_success',
        'auth_method' => 'google',
    ]);
});

test('sso callback rejects unknown email', function () {
    $socialUser = new class implements SocialiteUser {
        public array $user = ['email_verified' => true];

        public function getId()
        {
            return 'google-user-unknown';
        }

        public function getNickname()
        {
            return null;
        }

        public function getName()
        {
            return 'Unknown';
        }

        public function getEmail()
        {
            return 'unknown@example.com';
        }

        public function getAvatar()
        {
            return null;
        }
    };

    $driver = Mockery::mock();
    $driver->shouldReceive('user')->once()->andReturn($socialUser);

    Socialite::shouldReceive('driver')->with('google')->once()->andReturn($driver);

    $this->get(route('sso.callback', ['provider' => 'google']))
        ->assertRedirect(route('login'));

    $this->assertGuest();
});

