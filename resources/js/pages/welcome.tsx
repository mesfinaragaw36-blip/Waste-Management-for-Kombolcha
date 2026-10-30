
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowDown,
    ArrowRight,
    CheckCircle2,
    ClipboardList,
    Leaf,
    MapPin,
    Menu,
    Recycle,
    ShieldCheck,
    Truck,
    Users,
    X,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

const steps = [
    {
        number: '01',
        icon: ClipboardList,
        title: 'Report Waste',
        description:
            'Help identify waste problems in your neighborhood and make it easier for them to be addressed.',
    },
    {
        number: '02',
        icon: Truck,
        title: 'Coordinate Collection',
        description:
            'Support organized waste collection and better coordination between communities and collection teams.',
    },
    {
        number: '03',
        icon: Leaf,
        title: 'Keep Kombolcha Clean',
        description:
            'Work together toward cleaner streets, healthier surroundings, and more responsible waste disposal.',
    },
];

const features = [
    {
        icon: MapPin,
        title: 'Community Awareness',
        description:
            'Help communities identify waste concerns and understand the importance of proper waste disposal.',
    },
    {
        icon: Recycle,
        title: 'Responsible Disposal',
        description:
            'Encourage sorting, recycling, and responsible handling of waste to reduce environmental pollution.',
    },
    {
        icon: Users,
        title: 'Community Participation',
        description:
            'Bring residents and waste management stakeholders together around a cleaner city.',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Waste Management for Kombolcha" />

            <div
                id="home"
                className="min-h-screen overflow-hidden bg-white text-slate-800"
            >
                {/* Navigation */}
                <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-5 md:px-8">
                        <a
                            href="#home"
                            className="flex items-center gap-3"
                            aria-label="Kombolcha Clean City home"
                        >
                              <img
                                    src="/image/wast car 3.png"
                                    alt="Waste Management for Kombolcha Logo"
                                    className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                                />
                        </a>

                        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
                            <a
                                href="#home"
                                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-800"
                            >
                                Home
                            </a>
                            <a
                                href="#how-it-works"
                                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-800"
                            >
                                How It Works
                            </a>
                            <a
                                href="#features"
                                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-800"
                            >
                                Features
                            </a>
                            <a
                                href="#about"
                                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-800"
                            >
                                About Us
                            </a>
                        </nav>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Desktop auth buttons */}
                            <div className="hidden md:flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900"
                                    >
                                        Dashboard
                                        <ArrowRight size={16} />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900"
                                        >
                                            Get Started
                                            <ArrowRight size={16} />
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile burger menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu dropdown */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-slate-100 bg-white">
                            <div className="px-4 py-3 space-y-1">
                                <a
                                    href="#home"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                                >
                                    Home
                                </a>
                                <a
                                    href="#how-it-works"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                                >
                                    How It Works
                                </a>
                                <a
                                    href="#features"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                                >
                                    Features
                                </a>
                                <a
                                    href="#about"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                                >
                                    About Us
                                </a>
                                <div className="pt-2 border-t border-slate-100 space-y-2">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="block rounded-lg bg-emerald-800 px-3 py-2.5 text-center text-base font-bold text-white hover:bg-emerald-900"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={login()}
                                                className="block rounded-lg px-3 py-2.5 text-center text-base font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                                            >
                                                Log In
                                            </Link>
                                            <Link
                                                href={register()}
                                                className="block rounded-lg bg-emerald-800 px-3 py-2.5 text-center text-base font-bold text-white hover:bg-emerald-900"
                                            >
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <main>
                    {/* Hero */}
                    <section className="relative isolate">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-emerald-50" />

                        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-5 sm:py-16 md:gap-12 md:py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
                            <div className="relative mx-auto w-full max-w-lg">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm sm:mb-7 sm:px-4 sm:py-2 sm:text-sm">
                                    <Leaf size={16} className="sm:size-[17px]" />
                                    <span>A greener future for our city</span>
                                </div>

                                <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-6xl">
                                    A Cleaner Kombolcha{' '}
                                    <span className="text-emerald-800">
                                        Starts With You.
                                    </span>
                                </h1>

                                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:mt-6 sm:text-base md:text-lg md:leading-8">
                                    Together, we can improve waste management,
                                    encourage responsible disposal, and create
                                    a cleaner, healthier environment for
                                    everyone in Kombolcha.
                                </p>

                                <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                                    <Link
                                        href={auth.user ? dashboard() : register()}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-800/20 transition hover:-translate-y-0.5 hover:bg-emerald-900 sm:gap-3 sm:px-6 sm:py-3.5"
                                    >
                                        Get Started
                                        <ArrowRight size={18} className="sm:size-[19px]" />
                                    </Link>

                                    <a
                                        href="#how-it-works"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 sm:px-6 sm:py-3.5"
                                    >
                                        Discover More
                                        <ArrowDown size={17} className="sm:size-[18px]" />
                                    </a>
                                </div>

                                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 sm:mt-10 sm:gap-x-6 sm:gap-y-3 sm:text-sm">
                                    <span className="inline-flex items-center gap-2">
                                        <CheckCircle2
                                            size={16}
                                            className="text-emerald-800 sm:size-[18px]"
                                        />
                                        Cleaner neighborhoods
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <CheckCircle2
                                            size={16}
                                            className="text-emerald-800 sm:size-[18px]"
                                        />
                                        Community participation
                                    </span>
                                </div>
                            </div>

                            {/* Waste truck image */}
                            <div className="relative mx-auto mt-4 w-full max-w-md sm:mt-0 sm:max-w-lg lg:-mt-10 lg:-translate-y-30">
                                <img 
                                    src="/image/wast car.jpg" 
                                    alt="Waste collection truck"
                                    className="waste-truck-image mx-auto w-full object-contain"
                                    style={{ mixBlendMode: 'multiply' }}
                                />
                            </div>

                            <style>{`
                                @keyframes truck-slide-in {
                                    from {
                                        opacity: 0;
                                        transform: translateX(-50px);
                                    }
                                    to {
                                        opacity: 1;
                                        transform: translateX(0);
                                    }
                                }

                                @keyframes truck-float {
                                    0%, 100% {
                                        transform: translateY(0px);
                                    }
                                    50% {
                                        transform: translateY(-10px);
                                    }
                                }

                                .waste-truck-image {
                                    animation: truck-slide-in 1s ease-out, truck-float 3s ease-in-out 1s infinite;
                                }

                                @media (prefers-reduced-motion: reduce) {
                                    .waste-truck-image {
                                        animation: none;
                                    }
                                }
                            `}</style>
                        </div>
                    </section>

                    {/* How it works */}
                    <section
                        id="how-it-works"
                        className="scroll-mt-24 bg-white px-4 py-16 sm:px-5 sm:py-20 md:py-24"
                    >
                        <div className="mx-auto max-w-7xl">
                            <div className="mx-auto max-w-2xl text-center">
                                <span className="text-sm font-extrabold tracking-widest text-emerald-800 uppercase">
                                    Simple steps, real impact
                                </span>
                                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                    How It Works
                                </h2>
                                <p className="mt-4 leading-7 text-slate-600">
                                    Better waste management starts with
                                    awareness, coordination, and people
                                    working together.
                                </p>
                            </div>

                            <div className="mt-14 grid gap-6 md:grid-cols-3">
                                {steps.map((step) => {
                                    const Icon = step.icon;

                                    return (
                                        <article
                                            key={step.number}
                                            className="group rounded-3xl border border-slate-100 bg-slate-50/70 p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 sm:p-8"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 transition group-hover:bg-emerald-800 group-hover:text-white">
                                                    <Icon size={27} />
                                                </span>
                                                <span className="text-3xl font-black text-emerald-100">
                                                    {step.number}
                                                </span>
                                            </div>
                                            <h3 className="mt-7 text-xl font-extrabold text-slate-900">
                                                {step.title}
                                            </h3>
                                            <p className="mt-3 leading-7 text-slate-600">
                                                {step.description}
                                            </p>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section
                        id="features"
                        className="scroll-mt-24 bg-slate-50 px-4 py-16 sm:px-5 sm:py-20 md:py-24"
                    >
                        <div className="mx-auto max-w-7xl">
                            <div className="grid items-end gap-5 md:grid-cols-2">
                                <div>
                                    <span className="text-sm font-extrabold tracking-widest text-emerald-800 uppercase">
                                        What matters most
                                    </span>
                                    <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                        Better Waste Management,
                                        <br className="hidden sm:block" />{' '}
                                        Better Communities
                                    </h2>
                                </div>
                                <p className="max-w-xl leading-7 text-slate-600 md:justify-self-end">
                                    Our goal is to support a more organized,
                                    environmentally responsible approach to
                                    waste management in Kombolcha.
                                </p>
                            </div>

                            <div className="mt-12 grid gap-6 md:grid-cols-3">
                                {features.map((feature) => {
                                    const Icon = feature.icon;

                                    return (
                                        <article
                                            key={feature.title}
                                            className="rounded-2xl border border-slate-200/70 bg-white p-7 shadow-sm transition hover:border-emerald-50 hover:shadow-md"
                                        >
                                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                                                <Icon size={24} />
                                            </span>
                                            <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                                                {feature.title}
                                            </h3>
                                            <p className="mt-3 leading-7 text-slate-600">
                                                {feature.description}
                                            </p>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* About */}
                    <section
                        id="about"
                        className="scroll-mt-24 bg-white px-4 py-16 sm:px-5 sm:py-20 md:py-24"
                    >
                        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
                            <div className="relative overflow-hidden rounded-3xl bg-[#F0FDF4] p-8 text-black sm:p-12">
                                <div className="absolute -right-16 -bottom-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
                                <div className="relative">
                                    <Leaf
                                        size={42}
                                        className="text-emerald-300"
                                    />
                                    <p className="mt-8 text-sm font-bold tracking-widest text-emerald-500 uppercase">
                                        Our vision
                                    </p>
                                    <h2 className="mt-3 text-3xl leading-tight font-black sm:text-4xl">
                                        A healthier environment for
                                        generations to come.
                                    </h2>
                                    <p className="mt-5 leading-7 text-slate-600">
                                        A cleaner city is something we create
                                        together through awareness,
                                        responsibility, and consistent action.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span className="text-sm font-extrabold tracking-widest text-emerald-800 uppercase">
                                    About the project
                                </span>
                                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                    Working Toward a Cleaner Kombolcha
                                </h2>
                                <p className="mt-5 leading-8 text-slate-600">
                                    Waste Management for Kombolcha is a
                                    project focused on supporting improved
                                    waste handling and collection practices
                                    within the city. It aims to encourage
                                    responsible disposal, strengthen community
                                    participation, and support a cleaner urban
                                    environment.
                                </p>
                                <p className="mt-4 leading-8 text-slate-600">
                                    Lasting improvement depends on residents,
                                    communities, and waste management
                                    stakeholders working toward the same goal.
                                    Every responsible action makes a
                                    difference.
                                </p>

                                <a
                                    href="#how-it-works"
                                    className="mt-7 inline-flex items-center gap-2 font-bold text-emerald-800 transition hover:text-emerald-600"
                                >
                                    Explore how it works
                                    <ArrowRight size={18} />
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Call to action */}
                    <section className="px-4 pb-16 sm:px-5 sm:pb-20 md:pb-24">
                        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 rounded-3xl  bg-[#F0FDF4] px-5 py-8 sm:gap-7 sm:px-7 sm:py-10 md:flex-row md:items-center md:px-12 md:py-12">
                            <div className="max-w-2xl">
                                <h2 className="text-xl font-black text-black sm:text-2xl md:text-3xl">
                                    Be Part of a Cleaner Future
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
                                    Join the effort to make waste management
                                    better for Kombolcha and its communities.
                                </p>
                            </div>
                            <Link
                                href={auth.user ? dashboard() : register()}
                                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-100 sm:w-auto sm:gap-3 sm:px-6 sm:py-3.5"
                            >
                                Get Started
                                <ArrowRight size={17} className="sm:size-[18px]" />
                            </Link>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-100 bg-slate-50 px-4 py-6 sm:px-5 sm:py-8">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:gap-5 sm:text-left">
                        <a href="#home" className="flex items-center gap-3">
                             <img
                                    src="/image/wast car 3.png"
                                    alt="Waste Management for Kombolcha Logo"
                                    className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                                />
                            <span className="text-left">
                                <span className="block text-sm font-extrabold text-slate-900 sm:text-base">
                                    Waste Management
                                </span>
                                <span className="text-xs text-slate-500 sm:text-sm">
                                    For Kombolcha
                                </span>
                            </span>
                        </a>

                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} Waste Management for
                            Kombolcha. Building a cleaner future together.
                        </p>

                        <a
                            href="#home"
                            className="text-sm font-bold text-emerald-800 transition hover:text-emerald-600"
                        >
                            Back to top ↑
                        </a>
                    </div>
                </footer>
            </div>
        </>
    );
}
