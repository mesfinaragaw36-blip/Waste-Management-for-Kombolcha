<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
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
            ? new JsonResponse('', 201)
            : redirect()->intended($redirectUrl);
    }
}
