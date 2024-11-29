import {
    ArrowRight,
    BarChart2,
    Clock,
    Diamond,
    Menu,
    Shield,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Diamond className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl">GemTrack</span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="#features"
                            className="transition-colors hover:text-primary"
                        >
                            Features
                        </Link>
                        <Link
                            href="#about"
                            className="transition-colors hover:text-primary"
                        >
                            About
                        </Link>
                        <Link
                            href="#contact"
                            className="transition-colors hover:text-primary"
                        >
                            Contact
                        </Link>
                        <Link href="/login">
                            <Button variant="outline">Login</Button>
                        </Link>
                    </nav>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </header>

            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Revolutionize Your Diamond Management
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    GemTrack: The cutting-edge platform for
                                    seamless diamond tracking, inventory
                                    management, and business analytics.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Link href="/login">
                                    <Button size="lg">
                                        Get Started{' '}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button variant="outline" size="lg">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="features"
                    className="w-full py-12 md:py-24 lg:py-32"
                >
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                            Powerful Features
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <Diamond className="h-10 w-10 mb-4 text-primary" />
                                    <CardTitle>Precision Tracking</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Monitor every diamond in your inventory
                                        with unparalleled accuracy and detail.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <BarChart2 className="h-10 w-10 mb-4 text-primary" />
                                    <CardTitle>Advanced Analytics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Gain deep insights into your diamond
                                        business with our powerful analytics
                                        tools.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Shield className="h-10 w-10 mb-4 text-primary" />
                                    <CardTitle>Ironclad Security</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Rest easy knowing your data is protected
                                        by state-of-the-art security measures.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Clock className="h-10 w-10 mb-4 text-primary" />
                                    <CardTitle>Real-time Updates</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Stay informed with instant updates on
                                        your diamond inventory and processes.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <section
                    id="about"
                    className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
                >
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                            <div className="space-y-4 lg:w-1/2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    About GemTrack
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                                    GemTrack is a cutting-edge platform designed
                                    to revolutionize the way diamond businesses
                                    manage their inventory and processes. Our
                                    team of industry experts and technology
                                    innovators has developed a comprehensive
                                    solution to address the unique challenges
                                    faced by the diamond industry.
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                                    With GemTrack, you can streamline your
                                    operations, enhance transparency, and make
                                    data-driven decisions that propel your
                                    business forward in the competitive world of
                                    diamonds.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="contact"
                    className="w-full py-12 md:py-24 lg:py-32"
                >
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    Get in Touch
                                </h2>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                    Have questions or ready to transform your
                                    diamond business? Our team is here to help
                                    you succeed.
                                </p>
                            </div>
                            <div className="w-full max-w-sm space-y-2">
                                <Button className="w-full" size="lg">
                                    Schedule a Demo
                                </Button>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    size="lg"
                                >
                                    Contact Sales
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                            <Diamond className="h-6 w-6 text-primary" />
                            <span className="font-bold">GemTrack</span>
                        </div>
                        <p className="text-center text-sm leading-loose text-gray-500 dark:text-gray-400">
                            © 2024 GemTrack. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="#"
                                className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                            >
                                Terms
                            </Link>
                            <Link
                                href="#"
                                className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                            >
                                Privacy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
