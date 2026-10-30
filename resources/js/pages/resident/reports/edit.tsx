import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { show, update } from '@/actions/App/Http/Controllers/Resident/WasteReportController';
import type { WasteCategory, WasteReport } from '@/types';

type PageProps = {
    report: WasteReport;
    categories: WasteCategory[];
};

export default function EditReport({ report, categories }: PageProps) {
    return (
        <>
            <Head title={`Edit: ${report.title}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={show.url(report.id)}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Report</h1>
                        <p className="text-sm text-muted-foreground">
                            Update the details of your waste report
                        </p>
                    </div>
                </div>

                {report.status !== 'pending' && (
                    <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950">
                        <CardContent className="py-4">
                            <p className="text-sm text-amber-900 dark:text-amber-100">
                                You can only edit reports with &apos;pending&apos; status. This report is currently {report.status}.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Report Details</CardTitle>
                        <CardDescription>
                            Modify the information about the waste issue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form action={update.url(report.id)} method="put" encType="multipart/form-data">
                            {({ errors, processing }) => (
                                <div className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="waste_category_id">
                                                Category <span className="text-destructive">*</span>
                                            </Label>
                                            <Select
                                                name="waste_category_id"
                                                defaultValue={report.waste_category_id.toString()}
                                                required
                                            >
                                                <SelectTrigger id="waste_category_id">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={category.id.toString()}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.waste_category_id} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="priority">
                                                Priority <span className="text-destructive">*</span>
                                            </Label>
                                            <Select
                                                name="priority"
                                                defaultValue={report.priority}
                                                required
                                            >
                                                <SelectTrigger id="priority">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.priority} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="title">
                                            Title <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            defaultValue={report.title}
                                            placeholder="Brief title describing the issue"
                                            maxLength={255}
                                            required
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Description <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            defaultValue={report.description}
                                            placeholder="Detailed description of the waste issue"
                                            rows={5}
                                            minLength={10}
                                            maxLength={1000}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Minimum 10 characters, maximum 1000 characters
                                        </p>
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location_description">
                                            Location <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="location_description"
                                            name="location_description"
                                            defaultValue={report.location_description}
                                            placeholder="Describe the location (e.g., near City Hall)"
                                            maxLength={255}
                                            required
                                        />
                                        <InputError message={errors.location_description} />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="latitude">Latitude (optional)</Label>
                                            <Input
                                                id="latitude"
                                                name="latitude"
                                                type="number"
                                                step="any"
                                                defaultValue={report.latitude || ''}
                                                placeholder="e.g., 11.0942"
                                                min={-90}
                                                max={90}
                                            />
                                            <InputError message={errors.latitude} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="longitude">Longitude (optional)</Label>
                                            <Input
                                                id="longitude"
                                                name="longitude"
                                                type="number"
                                                step="any"
                                                defaultValue={report.longitude || ''}
                                                placeholder="e.g., 39.7397"
                                                min={-180}
                                                max={180}
                                            />
                                            <InputError message={errors.longitude} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {report.photo_path && (
                                            <div className="mb-4 space-y-2">
                                                <p className="text-sm font-medium">Current photo:</p>
                                                <img
                                                    src={`/storage/${report.photo_path}`}
                                                    alt="Current photo"
                                                    className="max-w-xs rounded-lg border"
                                                />
                                            </div>
                                        )}
                                        <Label htmlFor="photo">
                                            {report.photo_path ? 'Replace Photo (optional)' : 'Photo (optional)'}
                                        </Label>
                                        <Input
                                            id="photo"
                                            name="photo"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Maximum file size: 5MB. Accepted formats: JPEG, PNG, WebP
                                        </p>
                                        <InputError message={errors.photo} />
                                    </div>

                                    <div className="flex gap-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button type="button" variant="outline" asChild>
                                            <Link href={show.url(report.id)}>Cancel</Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditReport.layout = {
    breadcrumbs: [
        { title: 'My Reports', href: '/resident/reports' },
        { title: 'Edit Report', href: '#' },
    ],
};
