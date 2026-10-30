import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const [role, setRole] = useState<string>('resident');

    return (
        <>
            <Head title="Register" />

            <main className="fixed inset-0 z-[100] min-h-dvh w-full overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-50/40">
                {/* Decorative environmental SVG background */}
                <div className="absolute inset-0 opacity-[0.07]">
                    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="leaves" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                                {/* Leaf shape 1 */}
                                <path d="M50 80 Q 60 60, 70 80 Q 60 100, 50 80" fill="currentColor" className="text-emerald-600" opacity="0.3"/>
                                {/* Leaf shape 2 */}
                                <path d="M120 40 Q 135 25, 150 40 Q 135 55, 120 40" fill="currentColor" className="text-green-600" opacity="0.25"/>
                                {/* Recycling symbol */}
                                <circle cx="30" cy="150" r="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-700" opacity="0.2"/>
                                <path d="M30 140 L 35 150 L 25 150 Z" fill="currentColor" className="text-emerald-700" opacity="0.2"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#leaves)"/>
                    </svg>
                </div>

                {/* Subtle decorative circles */}
                <div className="absolute top-20 right-20 h-96 w-96 rounded-full bg-emerald-100/20 blur-3xl" />
                <div className="absolute bottom-32 left-10 h-80 w-80 rounded-full bg-green-100/15 blur-3xl" />
                <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-slate-100/25 blur-2xl" />

                <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col justify-center gap-6 px-4 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-12 xl:px-20">
                    {/* Left-side project information */}
                    <section className="hidden max-w-2xl lg:block">
                        <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900">
                            Let's Make Every Corner Clean.
                        </h1>

                        <p className="mb-8 max-w-xl text-base leading-7 text-slate-600">
                            A cleaner environment begins with awareness and action. Report waste issues, encourage proper disposal, and become part of the positive change.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xl">
                                    📍
                                </div>
                                <div className="pt-1">
                                    <p className="font-semibold text-emerald-700">
                                        Report Local Issues
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xl">
                                    🚮
                                </div>
                                <div className="pt-1">
                                    <p className="font-semibold text-emerald-700">
                                        Improve Collection
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xl">
                                    🏘️
                                </div>
                                <div className="pt-1">
                                    <p className="font-semibold text-emerald-700">
                                        Build a Better Community
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Compact registration card */}
                    <section className="mx-auto w-full max-w-xs rounded-2xl border border-slate-200/50 bg-white/95 p-4 shadow-2xl backdrop-blur-sm sm:max-w-sm sm:p-5 lg:mx-0 lg:max-w-md lg:p-6">
                        <div className="mb-4 text-center">
                            {/* <AppLogoIcon className="mx-auto mb-4 h-12 w-12 fill-current text-emerald-800" /> */}
                                <img
                                    src="/image/wast car 3.png"
                                    alt="Waste Management for Kombolcha Logo"
                                    className="mx-auto mb-4 h-16 w-16 object-contain"
                                />

                            <h2 className="mt-2 text-lg font-semibold tracking-tight text-emerald-950">
                                Create an Account
                            </h2>

                            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-600">
                                Join the Waste Management for Kombolcha system
                                and help build a cleaner, healthier city.
                            </p>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={[
                                'password',
                                'password_confirmation',
                            ]}
                            disableWhileProcessing
                            className="flex flex-col gap-2.5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="name"
                                            className="text-xs text-slate-800"
                                        >
                                            Full name
                                        </Label>

                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Full name"
                                            className="h-10 bg-white"
                                        />

                                        <InputError
                                            message={errors.name}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="email"
                                            className="text-xs text-slate-800"
                                        >
                                            Email address
                                        </Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@example.com"
                                            className="h-10 bg-white"
                                        />

                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="role"
                                            className="text-xs text-slate-800"
                                        >
                                            I am registering as
                                        </Label>

                                        <Select
                                            value={role}
                                            onValueChange={setRole}
                                            name="role"
                                            required
                                            disabled={processing}
                                        >
                                            <SelectTrigger
                                                id="role"
                                                tabIndex={3}
                                                className="h-10 w-full cursor-pointer border-slate-300 bg-white font-medium text-slate-900 shadow-sm focus-visible:border-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-0"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="z-[110] border-slate-200 bg-white p-1">
                                                <SelectItem
                                                    value="resident"
                                                    className="rounded-none border-0 text-slate-900 focus:bg-slate-50 focus:text-slate-900 data-[highlighted]:bg-slate-50 data-[highlighted]:text-slate-900"
                                                >
                                                    Resident
                                                </SelectItem>
                                                <SelectItem
                                                    value="worker"
                                                    className="rounded-none border-0 text-slate-900 focus:bg-slate-50 focus:text-slate-900 data-[highlighted]:bg-slate-50 data-[highlighted]:text-slate-900"
                                                >
                                                    Waste Collection Worker
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <InputError message={errors.role} />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="password"
                                            className="text-xs text-slate-800"
                                        >
                                            Password
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Password"
                                            passwordrules={passwordRules}
                                        />

                                        <InputError
                                            message={errors.password}
                                        />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="text-xs text-slate-800"
                                        >
                                            Confirm password
                                        </Label>

                                        <PasswordInput
                                            id="password_confirmation"
                                            required
                                            tabIndex={5}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Confirm password"
                                            passwordrules={passwordRules}
                                        />

                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-1 h-10 w-full bg-emerald-700 text-xs font-semibold text-white hover:bg-emerald-800"
                                        tabIndex={6}
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner />}
                                        Create account
                                    </Button>
                                </>
                            )}
                        </Form>

                        <p className="mt-4 text-center text-xs text-slate-600">
                            Already have an account?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={7}
                                className="font-bold text-emerald-800 hover:text-emerald-950"
                            >
                                Log in
                            </TextLink>
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}

// Register.layout = {
//     title: 'Create an account',
//     description: 'Enter your details below to create your account',
// };