
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowRight,
    CheckCircle2,
    ClipboardList,
    Leaf,
    MapPin,
    Recycle,
    ShieldCheck,
    Truck,
    Users,
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

    return (
        <>
            <Head title="Waste Management for Kombolcha" />

            <div
                id="home"
                className="min-h-screen overflow-hidden bg-white text-slate-800"
            >
                {/* Navigation */}
                <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
                        <a
                            href="#home"
                            className="flex items-center gap-3"
                            aria-label="Kombolcha Clean City home"
                        >
                            {/* <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-800 text-white shadow-sm">
                                <Recycle size={25} />
                            </span> */}
                              <img
                                    src="/image/wast car 3.png"
                                    alt="Waste Management for Kombolcha Logo"
                                    className="mx-auto mb-2 h-14 w-14 object-contain"
                                />
                            {/* <span>
                                <span className="block text-lg font-extrabold tracking-tight text-slate-900">
                                    Kombolcha
                                </span>
                                <span className="block text-xs font-semibold tracking-widest text-emerald-800 uppercase">
                                    Clean City
                                </span>
                            </span> */}
                        </a>

                        <nav className="hidden items-center gap-8 md:flex">
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

                        <div className="flex items-center gap-3">
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
                                        className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 sm:inline-flex"
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
                    </div>
                </header>

                <main>
                    {/* Hero */}
                    <section className="relative isolate">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-emerald-50" />

                        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:gap-20">
                            <div className="relative mx-auto -mt-4 w-full max-w-lg self-start -translate-y-7">
                                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm">
                                    <Leaf size={17} />
                                    <span>A greener future for our city</span>
                                </div>

                                <h1 className="max-w-2xl text-4xl leading-tight font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                                    A Cleaner Kombolcha{' '}
                                    <span className="text-emerald-800">
                                        Starts With You.
                                    </span>
                                </h1>

                                <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                                    Together, we can improve waste management,
                                    encourage responsible disposal, and create
                                    a cleaner, healthier environment for
                                    everyone in Kombolcha.
                                </p>

                                <div className="mt-9 flex flex-wrap items-center gap-4">
                                    <Link
                                        href={auth.user ? dashboard() : register()}
                                        className="inline-flex items-center gap-3 rounded-xl bg-emerald-800 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-800/20 transition hover:-translate-y-0.5 hover:bg-emerald-900"
                                    >
                                        Get Started
                                        <ArrowRight size={19} />
                                    </Link>

                                    <a
                                        href="#how-it-works"
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                                    >
                                        Discover More
                                        <ArrowDown size={18} />
                                    </a>
                                </div>

                                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
                                    <span className="inline-flex items-center gap-2">
                                        <CheckCircle2
                                            size={18}
                                            className="text-emerald-800"
                                        />
                                        Cleaner neighborhoods
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <CheckCircle2
                                            size={18}
                                            className="text-emerald-800"
                                        />
                                        Community participation
                                    </span>
                                </div>
                            </div>

                            {/* Waste truck image */}
                            <div className="relative mx-auto -mt-10 w-full max-w-lg self-start -translate-y-16">
                                <img 
                                    src="/image/wast car.jpg" 
                                    alt="Waste collection truck"
                                    className="waste-truck-image mx-auto w-full max-w-md object-contain"
                                    style={{ mixBlendMode: 'multiply' }}
                                />

                                {/* <div className="relative mt-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-lg shadow-emerald-900/5">
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                                        <MapPin size={24} />
                                    </span>
                                    <div>
                                        <p className="font-bold text-slate-900">
                                            Our City, Our Responsibility
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Building a cleaner Kombolcha
                                            together.
                                        </p>
                                    </div>
                                </div> */}
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
                        className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 sm:py-24"
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
                        className="scroll-mt-24 bg-slate-50 px-5 py-20 sm:px-8 sm:py-24"
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
                                            className="rounded-2xl border border-slate-200/70 bg-white p-7 shadow-sm transition hover:border-emerald-200 hover:shadow-lg"
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
                        className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 sm:py-24"
                    >
                        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
                            <div className="relative overflow-hidden rounded-3xl bg-emerald-900 p-8 text-white sm:p-12">
                                <div className="absolute -right-16 -bottom-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
                                <div className="relative">
                                    <Leaf
                                        size={42}
                                        className="text-emerald-300"
                                    />
                                    <p className="mt-8 text-sm font-bold tracking-widest text-emerald-200 uppercase">
                                        Our vision
                                    </p>
                                    <h2 className="mt-3 text-3xl leading-tight font-black sm:text-4xl">
                                        A healthier environment for
                                        generations to come.
                                    </h2>
                                    <p className="mt-5 leading-7 text-emerald-50">
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
                    <section className="px-5 pb-20 sm:px-8 sm:pb-24">
                        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 rounded-3xl bg-emerald-800 px-7 py-10 sm:px-12 sm:py-12 md:flex-row md:items-center">
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-black text-white sm:text-3xl">
                                    Be Part of a Cleaner Future
                                </h2>
                                <p className="mt-3 leading-7 text-emerald-50">
                                    Join the effort to make waste management
                                    better for Kombolcha and its communities.
                                </p>
                            </div>
                            <Link
                                href={auth.user ? dashboard() : register()}
                                className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-white px-6 py-3.5 font-extrabold text-emerald-800 transition hover:bg-emerald-50"
                            >
                                Get Started
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-100 bg-slate-50 px-5 py-8 sm:px-8">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
                        <a href="#home" className="flex items-center gap-3">
                            {/* <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-white">
                                <Recycle size={22} />
                            </span> */}
                             <img
                                    src="/image/wast car 3.png"
                                    alt="Waste Management for Kombolcha Logo"
                                    className="mx-auto mb-2 h-14 w-14 object-contain"
                                />
                            <span className="text-left">
                                <span className="block font-extrabold text-slate-900">
                                    Waste Management
                                </span>
                                <span className="text-sm text-slate-500">
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
