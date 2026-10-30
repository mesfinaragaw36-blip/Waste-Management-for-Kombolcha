import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import AppLogoIcon from '@/components/app-logo-icon';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const [role, setRole] = useState<string>('resident');

    return (
        <>
            <Head title="Register" />

            <main
                className="fixed inset-0 z-[100] min-h-dvh w-full overflow-y-auto bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg, rgba(4, 48, 35, 0.25), rgba(4, 48, 35, 0.05)), url('/images/waste-management-bg.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-slate-950/10" />

                <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col justify-center gap-6 px-4 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-12 xl:px-20">
                    {/* Left-side project information */}
                    <section className="hidden max-w-2xl text-white drop-shadow-md lg:block">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-3xl">
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

                        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-emerald-100">
                            Cleaner city, greener future
                        </p>

                        <h1 className="max-w-xl text-4xl leading-tight font-extrabold xl:text-6xl">
                            A Cleaner Kombolcha Starts With You.
                        </h1>

                        <p className="mt-5 max-w-xl text-lg leading-8 text-white">
                            Together we can improve waste management,
                            encourage responsible disposal, and build a
                            cleaner, healthier city for everyone.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-8">
                            <div>
                                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/20 text-xl">
                                    ♻
                                </span>
                                <p className="text-sm font-semibold">
                                    Clean Environment
                                </p>
                            </div>

                            <div>
                                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/20 text-xl">
                                    👥
                                </span>
                                <p className="text-sm font-semibold">
                                    Healthy Community
                                </p>
                            </div>

                            <div>
                                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/20 text-xl">
                                    🌱
                                </span>
                                <p className="text-sm font-semibold">
                                    Sustainable Future
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Compact registration card */}
                    <section className="mx-auto w-full max-w-sm rounded-2xl border border-white/70 bg-white/95 p-5 shadow-2xl backdrop-blur-md sm:p-6 lg:mx-0 lg:max-w-md lg:p-6">
                        <div className="mb-4 text-center">
                            {/* <AppLogoIcon className="mx-auto mb-4 h-12 w-12 fill-current text-emerald-800" /> */}
                                <img
                                    src="/image/wast car 3.png"
                                    alt="Waste Management for Kombolcha Logo"
                                    className="mx-auto mb-4 h-16 w-16 object-contain"
                                />

                            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-emerald-950">
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
                            className="flex flex-col gap-3"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-1.5">
                                        <Label
                                            htmlFor="name"
                                            className="text-sm text-slate-800"
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
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@example.com"
                                            className="h-10 bg-white"
                                        />

                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label
                                            htmlFor="role"
                                            className="text-sm text-slate-800"
                                        >
                                            I am registering as
                                        </Label>

                                        <select
                                            id="role"
                                            name="role"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                            tabIndex={3}
                                            disabled={processing}
                                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="resident">Resident</option>
                                            <option value="worker">Waste Collection Worker</option>
                                        </select>

                                        <InputError message={errors.role} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm text-slate-800"
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

                                    <div className="grid gap-1.5">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="text-sm text-slate-800"
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
                                        className="mt-1 h-10 w-full bg-emerald-700 font-semibold text-white hover:bg-emerald-800"
                                        tabIndex={6}
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner />}
                                        Create account
                                    </Button>
                                </>
                            )}
                        </Form>

                        <p className="mt-4 text-center text-sm text-slate-600">
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