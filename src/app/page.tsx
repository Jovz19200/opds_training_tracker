import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12  md:pt-10 lg:py-32 sm:px-6 px-4">
          <div className="container flex mx-auto max-w-7xl flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl max-w-[64rem] sm:text-5xl md:text-6xl lg:text-7xl">
              Streamline Training Management for{" "}
              <span className="text-primary">OPDs</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Enhance stakeholder development with our comprehensive training management system. 
              Automate processes, track progress, and drive organizational growth.
            </p>
            <div className="gap-3 flex flex-col w-full sm:w-auto sm:flex-row">
              <Button asChild size="lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-6 bg-slate-50 dark:bg-black w-full md:py-12 lg:py-24">
  <div className="mx-auto px-4 flex max-w-[58rem] flex-col items-center space-y-4 text-center">
    <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
      Key Features
    </h2>
    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
      Discover how OTMS can transform your training management process
    </p>
  </div>
  <div className="mx-auto grid justify-center gap-6 px-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
    {features.map((feature) => (
      <div
        key={feature.title}
        className="relative overflow-hidden rounded-xl border border-gray-800 dark:border-slate-800/50 bg-background p-2 dark:bg-slate-900/10 backdrop-blur-sm dark:backdrop-blur-md hover:dark:border-slate-700/50 transition-colors"
      >
        <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        </div>
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-900/20 dark:to-transparent pointer-events-none"></div>
      </div>
    ))}
  </div>
</section>

        {/* CTA Section */}
        <section className=" py-8 md:py-12 lg:py-24 w-full">
          <div className="container flex mx-auto max-w-7xl flex-col items-center space-y-4 text-center">
            <h2 className="font-heading max-w-[58rem] text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Ready to Transform Your Training Management?
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Join the growing number of OPDs using OTMS to streamline their training processes
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

const features = [
  {
    title: "Centralized Training Management",
    description: "Manage all training activities from a single platform with real-time updates and tracking.",
  },
  {
    title: "Automated Processes",
    description: "Streamline registration, attendance tracking, and reporting with automated workflows.",
  },
  {
    title: "Data Analytics",
    description: "Gain insights into training effectiveness and make data-driven decisions.",
  },
  {
    title: "Real-time Communication",
    description: "Keep all stakeholders informed with automated notifications and updates.",
  },
  {
    title: "Progress Tracking",
    description: "Monitor trainee progress and identify areas for improvement.",
  },
  {
    title: "Resource Management",
    description: "Efficiently allocate and manage training resources and materials.",
  },
]
