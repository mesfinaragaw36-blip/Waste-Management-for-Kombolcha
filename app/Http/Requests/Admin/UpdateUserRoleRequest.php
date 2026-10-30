<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('changeRole', [$this->route('user'), $this->route('user')]);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'role' => [
                'required',
                'string',
                Rule::in(User::VALID_ROLES),
            ],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'role.in' => 'The selected role is invalid. Valid roles are: '.implode(', ', User::VALID_ROLES),
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $targetUser = $this->route('user');

        // Prevent self role change
        if ($this->user()->id === $targetUser->id) {
            abort(403, 'You cannot change your own role.');
        }

        // Protect last administrator
        if ($targetUser->isAdministrator() && $this->input('role') !== User::ROLE_ADMINISTRATOR) {
            $adminCount = User::where('role', User::ROLE_ADMINISTRATOR)->count();
            if ($adminCount <= 1) {
                abort(422, 'Cannot change the role of the last administrator.');
            }
        }
    }
}
