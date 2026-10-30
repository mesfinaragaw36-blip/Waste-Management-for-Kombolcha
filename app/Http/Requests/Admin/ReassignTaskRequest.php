<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReassignTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('task'));
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'assigned_worker_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->where('role', User::ROLE_WORKER);
                }),
            ],
            'scheduled_at' => ['nullable', 'date', 'after_or_equal:today'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'assigned_worker_id' => 'worker',
            'scheduled_at' => 'scheduled date',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'assigned_worker_id.exists' => 'The selected user must be a worker.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $task = $this->route('task');

        // Cannot reassign completed tasks
        if ($task->status === 'completed') {
            abort(422, 'Completed tasks cannot be reassigned.');
        }

        // Cannot reassign cancelled tasks
        if ($task->status === 'cancelled') {
            abort(422, 'Cancelled tasks cannot be reassigned.');
        }
    }
}
