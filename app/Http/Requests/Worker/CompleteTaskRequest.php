<?php

namespace App\Http\Requests\Worker;

use Illuminate\Foundation\Http\FormRequest;

class CompleteTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('complete', $this->route('task'));
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'completion_notes' => ['required', 'string', 'min:10', 'max:1000'],
            'completion_photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'completion_notes' => 'completion notes',
            'completion_photo' => 'photo',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $task = $this->route('task');
        if ($task->status !== 'in_progress') {
            abort(422, 'Task must be in progress to complete it.');
        }
    }
}
