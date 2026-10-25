
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

            <main
                className="fixed inset-0 z-[100] min-h-dvh w-full overflow-y-auto bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg, rgba(4, 48, 35, 0.25), rgba(4, 48, 35, 0.05)), url('/images/waste-management-bg.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-slate-950/10" />

                <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col justify-center gap-8 px-4 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-12 xl:px-20">
                    {/* Left-side project introduction */}
                    <section className="hidden max-w-2xl text-white drop-shadow-md lg:block">
                        <div className="mb-12 flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-4xl text-emerald-800">
                                ♻
                            </div>

                            <div>
                                <p className="text-2xl font-bold">
                                    Waste Management
                                </p>
                                <p className="text-xl font-medium">
                                    for Kombolcha
                                </p>
                            </div>
                        </div>

                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-emerald-100">
                            Cleaner city, greener future
                        </p>

                        <h1 className="max-w-xl text-4xl leading-tight font-extrabold xl:text-6xl">
                            A Cleaner Kombolcha Starts With You.
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-white">
                            Together we can improve waste management,
                            encourage responsible disposal, and build a
                            cleaner, healthier city for everyone.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-8">
                            <div>
                                <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/20 text-2xl">
                                    ♻
                                </span>
                                <p className="font-semibold">
                                    Clean Environment
                                </p>
                            </div>

                            <div>
                                <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/20 text-2xl">
                                    👥
                                </span>
                                <p className="font-semibold">
                                    Healthy Community
                                </p>
                            </div>

                            <div>
                                <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/20 text-2xl">
                                    🌱
                                </span>
                                <p className="font-semibold">
                                    Sustainable Future
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Login card */}
                    <section className="mx-auto w-full max-w-sm rounded-2xl border border-white/70 bg-white/90 p-5 shadow-2xl backdrop-blur-md sm:p-6 lg:mx-0 lg:max-w-md lg:p-7">
                        <div className="mb-5 text-center">
                            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-800">
                                ♻
                            </div>

                            <h2 className="text-2xl font-extrabold tracking-tight text-emerald-950">
                                Welcome Back
                            </h2>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-slate-600">
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
                            className="flex flex-col gap-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-1.5">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm text-slate-800"
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

                                    <div className="grid gap-1.5">
                                        <div className="flex items-center justify-between gap-3">
                                            <Label
                                                htmlFor="password"
                                                className="text-sm text-slate-800"
                                            >
                                                Password
                                            </Label>

                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 sm:text-sm"
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
                                            className="cursor-pointer text-sm text-slate-700"
                                        >
                                            Remember me
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-10 w-full bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800"
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
                        <p className="mt-0 text-center text-sm leading-6 text-slate-600">
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
