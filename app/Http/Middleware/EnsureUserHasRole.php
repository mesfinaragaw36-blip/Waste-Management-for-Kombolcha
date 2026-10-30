<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Ensure user is authenticated
        if (! $request->user()) {
            abort(403, 'Unauthorized access.');
        }

        /** @var User $user */
        $user = $request->user();

        // Check if user has any of the required roles
        if (! $user->hasAnyRole($roles)) {
            abort(403, 'You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
