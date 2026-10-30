<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('review', $this->route('report'));
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::in(['under_review', 'approved', 'rejected'])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $report = $this->route('report');
        $currentStatus = $report->status;
        $newStatus = $this->input('status');

        // Validate status transition
        $validTransitions = [
            'pending' => ['under_review', 'rejected'],
            'under_review' => ['approved', 'rejected'],
        ];

        if (! isset($validTransitions[$currentStatus])) {
            abort(422, "Cannot review report with status '{$currentStatus}'.");
        }

        if (! in_array($newStatus, $validTransitions[$currentStatus])) {
            abort(422, "Invalid status transition from '{$currentStatus}' to '{$newStatus}'.");
        }

        // Require notes for rejected reports
        if ($newStatus === 'rejected' && empty($this->input('notes'))) {
            $this->merge(['_rejection_validation' => true]);
        }
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'notes.required' => 'Rejection reason is required when rejecting a report.',
        ];
    }

    /**
     * Get additional validation rules based on status.
     */
    public function withValidator($validator): void
    {
        if ($this->input('status') === 'rejected') {
            $validator->addRules([
                'notes' => ['required', 'string', 'min:10', 'max:1000'],
            ]);
        }
    }
}
