
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

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

                <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col justify-center gap-8 px-4 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-12 xl:px-20">
                    {/* Left-side project introduction */}
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

                    {/* Login card */}
                    <section className="mx-auto w-full max-w-xs rounded-2xl border border-slate-200/50 bg-white/95 p-4 shadow-2xl backdrop-blur-sm sm:max-w-sm sm:p-5 lg:mx-0 lg:max-w-md lg:p-6">
                        <div className="mb-4 text-center">
                              <img
                                    src="/image/wast car 3.png"
                                    alt="Waste Management for Kombolcha Logo"
                                    className="mx-auto mb-4 h-16 w-16 object-contain"
                                />

                            <h2 className="text-lg font-semibold tracking-tight text-emerald-950">
                                Welcome Back
                            </h2>

                            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-600">
                                Log in to your account to continue to the
                                Waste Management for Kombolcha.
                            </p>
                        </div>

                        {status && (
                            <div
                                role="status"
                                className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-800"
                            >
                                {status}
                            </div>
                        )}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-3"
                        >
                            {({ processing, errors }) => (
                                <>
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
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                            className="h-10 bg-white"
                                        />

                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <Label
                                                htmlFor="password"
                                                className="text-xs text-slate-800"
                                            >
                                                Password
                                            </Label>

                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950"
                                                    tabIndex={5}
                                                >
                                                    Forgot your password?
                                                </TextLink>
                                            )}
                                        </div>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Password"
                                        />

                                        <InputError
                                            message={errors.password}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                        />

                                        <Label
                                            htmlFor="remember"
                                            className="cursor-pointer text-xs text-slate-700"
                                        >
                                            Remember me
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-10 w-full bg-emerald-700 text-xs font-semibold text-white hover:bg-emerald-800"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner />}
                                        Log in
                                    </Button>
                                </>
                            )}
                        </Form>

                        {/* Passkey section */}
                        <div className="mt-5 flex w-full justify-center">
                            <div className="w-full max-w-full">
                                <PasskeyVerify />
                            </div>
                        </div>

                        {/* Registration link */}
                        <p className="mt-0 text-center text-xs leading-6 text-slate-600">
                            Don&apos;t have an account?{' '}
                            <TextLink
                                href={register()}
                                tabIndex={6}
                                className="font-bold text-emerald-800 underline-offset-4 hover:text-emerald-950 hover:underline"
                            >
                                Sign up
                            </TextLink>
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}

// Login.layout = {
//     title: 'Log in to your account',
//     description: 'Enter your email and password below to log in',
// };
