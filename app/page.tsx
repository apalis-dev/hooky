import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle,
  Code,
  GitBranch,
  Scale,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
    <div className="container mx-auto flex h-16 items-center justify-between">
      <div className="flex items-center gap-2">
        <Zap className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">Hooky</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <a
          href="#"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "hidden sm:flex"
          )}
        >
          Sign In
        </a>
        <a href="#" className={cn(buttonVariants({ variant: "default" }))}>
          Get Started
        </a>
      </div>
    </div>
  </header>
);

const HeroSection = () => (
  <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
    <div className="absolute top-0 left-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
    <div className="container mx-auto text-center">
      <div className="mb-6">
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1 text-sm text-secondary-foreground transition-colors hover:bg-secondary"
        >
          <span className="font-semibold">Now in Public Beta</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
        Reliable Webhook Delivery
        <br />
        <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Without the Complexity
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
        The sweet spot between expensive enterprise tools and unreliable DIY
        systems. Get 99.9% delivery rates and a 5-minute setup.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="#"
          className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
        >
          Start for Free <ArrowRight className="ml-2 h-5 w-5" />
        </a>
        <a
          href="#"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "w-full sm:w-auto"
          )}
        >
          Read the Docs
        </a>
      </div>
    </div>
  </section>
);

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="relative overflow-hidden rounded-lg border bg-background/50 p-6 backdrop-blur-sm">
    <div className="absolute -top-1 -left-1 h-16 w-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl"></div>
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-bold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const FeaturesSection = () => (
  <section id="features" className="py-20">
    <div className="container mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Why Developers Choose Hooky
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Stop worrying about webhook infrastructure. We handle the scaling,
          monitoring, and debugging for you.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<Zap className="h-6 w-6" />}
          title="5-Minute Setup"
          description="Go from sign-up to your first webhook delivery in minutes. No complex configurations required."
        />
        <FeatureCard
          icon={<CheckCircle className="h-6 w-6" />}
          title="Guaranteed Delivery"
          description="With intelligent retries and exponential backoff, we ensure a >99% delivery success rate."
        />
        <FeatureCard
          icon={<Scale className="h-6 w-6" />}
          title="Scales With You"
          description="From 100 to 100 million webhooks, our infrastructure is built to handle your growth."
        />
        <FeatureCard
          icon={<Code className="h-6 w-6" />}
          title="Developer-First API"
          description="A clean, modern REST API that makes integration and management a breeze."
        />
        <FeatureCard
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Secure & Authenticated"
          description="Protect your endpoints with HMAC signature verification and other security features."
        />
        <FeatureCard
          icon={<GitBranch className="h-6 w-6" />}
          title="Advanced Debugging"
          description="A real-time dashboard with detailed logs, payload inspection, and manual retry capabilities."
        />
      </div>
    </div>
  </section>
);

const PricingSection = () => (
  <section id="pricing" className="py-20 bg-secondary/30">
    <div className="container mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Simple, Transparent Pricing
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Pay only for what you use. No hidden fees, no enterprise contracts.
        </p>
      </div>
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <Card className="border-2 border-primary/50 shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Hacker</CardTitle>
            <CardDescription>
              Perfect for personal projects and startups.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-bold">
              $5
              <span className="text-lg font-normal text-muted-foreground">
                /mo
              </span>
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" /> 10,000
                webhooks/mo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" /> 3 endpoints
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" /> 7-day log
                retention
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg">
              Get Started
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>
              For growing businesses that need to scale.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-bold">
              $25
              <span className="text-lg font-normal text-muted-foreground">
                /mo
              </span>
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" /> 100,000
                webhooks/mo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" /> Unlimited
                endpoints
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" /> 30-day log
                retention
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" size="lg">
              Choose Pro
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </section>
);

const CtaSection = () => (
  <section className="py-24">
    <div className="container mx-auto">
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-12 text-center">
        <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative">
          <h2 className="text-4xl font-extrabold text-primary-foreground">
            Ready to Ship Webhooks?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
            Stop building boilerplate and focus on your product. Integrate Hooky
            in minutes and never lose a webhook again.
          </p>
          <div className="mt-8">
            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" })
              )}
            >
              Sign Up and Start Sending <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t">
    <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Hooky. All rights reserved.
      </p>
      <div className="flex items-center gap-4">
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Terms
        </a>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Privacy
        </a>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Docs
        </a>
      </div>
    </div>
  </footer>
);

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
