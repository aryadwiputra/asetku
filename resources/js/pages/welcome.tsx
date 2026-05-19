import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, ChevronDown, CheckCircle2, ClipboardList, FileBarChart2, MapPinned, QrCode, Wrench } from 'lucide-react';
import { useState } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';

type WelcomeProps = {
    canRegister?: boolean;
};

const mainFeatures = [
    {
        icon: ClipboardList,
        title: 'Data aset lebih rapi',
        description: 'Catat aset lengkap dengan lokasi, PIC, kategori, dokumen, dan foto dalam satu sistem yang gampang dicari lagi.',
    },
    {
        icon: QrCode,
        title: 'QR untuk cek cepat',
        description: 'Setiap aset bisa punya QR sendiri, jadi tim tinggal scan untuk lihat detail aset saat di lapangan.',
    },
    {
        icon: MapPinned,
        title: 'Perpindahan lebih jelas',
        description: 'Mutasi aset, perubahan status, dan perpindahan antar lokasi tercatat rapi supaya tidak hilang jejak.',
    },
    {
        icon: Wrench,
        title: 'Maintenance lebih terkontrol',
        description: 'Atur jadwal maintenance, work order, dan reminder supaya operasional tetap jalan tanpa banyak miss.',
    },
    {
        icon: FileBarChart2,
        title: 'Audit dan laporan lebih siap',
        description: 'Data aset, histori, dan laporan lebih siap dipakai saat stocktake, audit, atau review manajemen.',
    },
];

const faqs = [
    {
        question: 'Asetku cocok buat perusahaan seperti apa?',
        answer: 'Asetku paling cocok untuk perusahaan yang punya banyak aset, banyak lokasi, atau banyak cabang, dan butuh pengelolaan aset yang lebih rapi dari operasional sampai pelaporan.',
    },
    {
        question: 'Apakah Asetku cuma untuk inventaris aset?',
        answer: 'Bukan. Asetku lebih luas dari inventaris biasa karena mencakup QR label, perpindahan aset, maintenance, audit, work order, sampai depresiasi dan reporting.',
    },
    {
        question: 'Apakah setiap aset bisa punya QR sendiri?',
        answer: 'Bisa. Setiap aset bisa dibuatkan QR label sendiri supaya proses pengecekan di lapangan jadi lebih cepat dan lebih praktis.',
    },
    {
        question: 'Apakah cocok untuk bisnis multi-cabang?',
        answer: 'Cocok. Asetku dirancang untuk struktur organisasi yang lebih kompleks, termasuk banyak cabang, banyak lokasi, dan lebih dari satu unit bisnis.',
    },
];

function SectionContainer({ children, className }: { children: React.ReactNode; className?: string }) {
    return <section className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</section>;
}

function FaqItem({ question, answer, open, onOpenChange }: { question: string; answer: string; open: boolean; onOpenChange: (open: boolean) => void }) {
    return (
        <Collapsible open={open} onOpenChange={onOpenChange}>
            <div className="rounded-2xl border border-border bg-background">
                <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                        <span className="text-base font-semibold text-foreground">{question}</span>
                        <ChevronDown className={cn('h-5 w-5 text-muted-foreground transition-transform', open && 'rotate-180')} />
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="px-5 pb-5 text-sm leading-7 text-muted-foreground">{answer}</div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
}

export default function Welcome({ canRegister = true }: WelcomeProps) {
    const { auth } = usePage().props as {
        auth: { user?: unknown };
    };
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const primaryHref = auth.user ? dashboard() : login();
    const primaryLabel = auth.user ? 'Masuk ke Dashboard' : 'Lihat Demo';

    return (
        <>
            <Head title="Asetku — Platform Manajemen Aset Perusahaan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                                <AppLogoIcon className="size-6 fill-current" />
                            </div>
                            <div>
                                <div className="text-base font-semibold tracking-tight">Asetku</div>
                                <div className="text-xs text-muted-foreground">Platform manajemen aset perusahaan</div>
                            </div>
                        </Link>

                        <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
                            <a href="#fitur" className="transition hover:text-foreground">
                                Fitur
                            </a>
                            <a href="#tentang" className="transition hover:text-foreground">
                                Kenapa Asetku
                            </a>
                            <a href="#faq" className="transition hover:text-foreground">
                                FAQ
                            </a>
                        </nav>

                        <div className="flex items-center gap-2">
                            {!auth.user ? (
                                <Link href={login()}>
                                    <Button variant="ghost" className="hidden sm:inline-flex">
                                        Masuk
                                    </Button>
                                </Link>
                            ) : null}
                            {canRegister && !auth.user ? (
                                <Link href={register()}>
                                    <Button className="rounded-full px-5">Coba Sekarang</Button>
                                </Link>
                            ) : (
                                <Link href={primaryHref}>
                                    <Button className="rounded-full px-5">{primaryLabel}</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    <SectionContainer className="py-16 sm:py-20 lg:py-24">
                        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
                                    Buat tim operasional, admin, finance, dan manajemen
                                </div>
                                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                    Kelola aset perusahaan dalam satu sistem yang rapi dan gampang dipantau
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                    Dari pencatatan aset, QR label, perpindahan, maintenance, audit, sampai depresiasi — semua bisa dikelola
                                    di Asetku tanpa ribet dan tanpa bolak-balik spreadsheet.
                                </p>
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <Link href={primaryHref}>
                                        <Button size="lg" className="w-full rounded-full px-6 sm:w-auto">
                                            {primaryLabel}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <a href="#fitur">
                                        <Button size="lg" variant="outline" className="w-full rounded-full px-6 sm:w-auto">
                                            Lihat Fitur Utama
                                        </Button>
                                    </a>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-sm">
                                <img src="/assets-image/images/assets (1).jpg" alt="Pengelolaan aset perusahaan" className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]" />
                            </div>
                        </div>
                    </SectionContainer>

                    <SectionContainer id="fitur" className="py-16 sm:py-20">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Fitur utama</div>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                Semua yang dibutuhkan untuk ngelola aset, tanpa bikin orang baru bingung
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-muted-foreground">
                                Fokus Asetku bukan bikin tampilan ramai, tapi bikin tim cepat paham dan cepat kerja.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-5">
                            {mainFeatures.map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <div key={feature.title} className="flex flex-col items-center text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-foreground">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </SectionContainer>

                    <SectionContainer id="tentang" className="py-16 sm:py-20">
                        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                            <div className="max-w-2xl">
                                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Kenapa Asetku</div>
                                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Cocok buat perusahaan yang asetnya banyak, lokasinya banyak, dan prosesnya sudah mulai kompleks
                                </h2>
                                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                                    Asetku bantu semua data aset tetap nyambung, dari saat aset didaftarkan, dipindahkan, dicek lewat QR,
                                    dijadwalkan maintenance, sampai masuk ke audit dan pelaporan.
                                </p>
                                <div className="mt-8 space-y-4">
                                    {[
                                        'Lebih gampang tahu aset ada di mana dan sedang dipakai siapa',
                                        'Perubahan lokasi, status, dan penanggung jawab tercatat lebih jelas',
                                        'Maintenance, audit, dan review manajemen jadi lebih siap',
                                    ].map((item) => (
                                        <div key={item} className="flex gap-3 text-sm leading-7 text-muted-foreground">
                                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-sm">
                                <img src="/assets-image/images/assets (2).jpg" alt="Tim operasional aset" className="h-[320px] w-full object-cover sm:h-[420px]" />
                            </div>
                        </div>
                    </SectionContainer>

                    <SectionContainer className="py-16 sm:py-20">
                        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                            <div className="order-2 overflow-hidden rounded-[32px] border border-border bg-card shadow-sm lg:order-1">
                                <img src="/assets-image/images/assets (4).jpg" alt="Dokumentasi aset lapangan" className="h-[320px] w-full object-cover sm:h-[420px]" />
                            </div>

                            <div className="order-1 max-w-2xl lg:order-2">
                                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">End-to-end</div>
                                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Bukan cuma inventaris, tapi alur kerja aset dari awal sampai akhir
                                </h2>
                                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                                    Asetku lebih cocok dipakai sebagai platform manajemen aset perusahaan, karena tidak berhenti di pencatatan.
                                    Sistem ini membantu tim menghubungkan data aset, operasional lapangan, maintenance, audit, dan depresiasi dalam satu alur.
                                </p>
                                <div className="mt-8 space-y-4">
                                    {[
                                        'Registrasi dan QR label',
                                        'Perpindahan dan histori aset',
                                        'Maintenance, work order, dan reminder',
                                        'Audit, stocktake, depresiasi, dan laporan',
                                    ].map((item) => (
                                        <div key={item} className="flex gap-3 text-sm leading-7 text-muted-foreground">
                                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionContainer>

                    <SectionContainer id="faq" className="py-16 sm:py-20">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">FAQ</div>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                Pertanyaan yang biasanya muncul saat pertama kali kenal Asetku
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-muted-foreground">
                                Supaya pengunjung baru langsung kebayang apakah Asetku cocok untuk kebutuhan perusahaannya.
                            </p>
                        </div>

                        <div className="mx-auto mt-10 max-w-3xl space-y-4">
                            {faqs.map((item, index) => (
                                <FaqItem
                                    key={item.question}
                                    question={item.question}
                                    answer={item.answer}
                                    open={openFaq === index}
                                    onOpenChange={(open) => setOpenFaq(open ? index : null)}
                                />
                            ))}
                        </div>
                    </SectionContainer>
                </main>

                <footer className="border-t border-border bg-muted/40">
                    <SectionContainer className="py-10">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                            <div className="max-w-md">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                        <AppLogoIcon className="size-5 fill-current" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Asetku</div>
                                        <div className="text-sm text-muted-foreground">Platform manajemen aset perusahaan</div>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                    Bantu tim Anda ngelola aset lebih rapi, lebih gampang dipantau, dan lebih siap untuk operasional harian maupun audit.
                                </p>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <div className="text-sm font-semibold">Navigasi</div>
                                    <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                                        <a href="#fitur" className="hover:text-foreground">Fitur</a>
                                        <a href="#tentang" className="hover:text-foreground">Kenapa Asetku</a>
                                        <a href="#faq" className="hover:text-foreground">FAQ</a>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm font-semibold">Akses</div>
                                    <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                                        <Link href={login()} className="hover:text-foreground">Masuk</Link>
                                        {canRegister ? <Link href={register()} className="hover:text-foreground">Daftar</Link> : null}
                                        <Link href={primaryHref} className="hover:text-foreground">{primaryLabel}</Link>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm font-semibold">Fokus utama</div>
                                    <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                                        <span>Registrasi aset</span>
                                        <span>QR & tracking</span>
                                        <span>Maintenance & audit</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
                            © 2026 Asetku. Dibuat untuk bantu pengelolaan aset perusahaan jadi lebih rapi.
                        </div>
                    </SectionContainer>
                </footer>
            </div>
        </>
    );
}
