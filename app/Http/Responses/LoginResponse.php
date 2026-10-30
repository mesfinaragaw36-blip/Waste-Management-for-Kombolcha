<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request): RedirectResponse|JsonResponse
    {
        $user = $request->user();

        // Determine redirect based on authenticated user's role
        $redirectUrl = match ($user->role) {
            'resident' => route('resident.dashboard'),
            'worker' => route('worker.dashboard'),
            'administrator' => route('admin.dashboard'),
            default => route('dashboard'),
        };

        return $request->wantsJson()
            ? new JsonResponse('', 204)
            : redirect()->intended($redirectUrl);
    }
}
