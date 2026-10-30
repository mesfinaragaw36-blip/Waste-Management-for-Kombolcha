import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { index, store } from '@/actions/App/Http/Controllers/Resident/WasteReportController';
import type { WasteCategory } from '@/types';

type PageProps = {
    categories: WasteCategory[];
};

export default function CreateReport({ categories }: PageProps) {
    return (
        <>
            <Head title="Report Waste" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Report Waste</h1>
                        <p className="text-muted-foreground">
                            Submit a new waste issue report
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Report Details</CardTitle>
                        <CardDescription>
                            Provide information about the waste issue you&apos;ve encountered
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form action={store.url()} method="post" encType="multipart/form-data">
                            {({ errors, processing }) => (
                                <div className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="waste_category_id">
                                                Category <span className="text-destructive">*</span>
                                            </Label>
                                            <Select name="waste_category_id" required>
                                                <SelectTrigger id="waste_category_id">
                                                    <SelectValue placeholder="Select a category" />
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
                                            <Select name="priority" defaultValue="medium" required>
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
                                                placeholder="e.g., 39.7397"
                                                min={-180}
                                                max={180}
                                            />
                                            <InputError message={errors.longitude} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="photo">Photo (optional)</Label>
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
                                            {processing ? 'Submitting...' : 'Submit Report'}
                                        </Button>
                                        <Button type="button" variant="outline" asChild>
                                            <Link href={index.url()}>Cancel</Link>
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

CreateReport.layout = {
    breadcrumbs: [
        { title: 'My Reports', href: '/resident/reports' },
        { title: 'Report Waste', href: '/resident/reports/create' },
    ],
};
