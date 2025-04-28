import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckCircle2, BarChart3, Bell, Users, Calendar, BookOpen, FileText, ShieldCheck } from "lucide-react"
import Image from "next/image"

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-50 dark:bg-gradient-to-b dark:from-black dark:to-zinc-900 py-12 md:py-24">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">OTMS Features</h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Discover how our Organization Training Management System empowers OPDs to streamline 
                training processes, improve decision-making, and bridge beneficiaries' skill gaps.
              </p>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Centralized Training Management</h2>
                <p className="text-muted-foreground mb-6">
                  OTMS provides a unified platform to manage all training-related information and activities, 
                  eliminating data fragmentation and improving accessibility for all stakeholders.
                </p>
                <ul className="space-y-3">
                  {[
                    "Streamlined course creation and management",
                    "Centralized repository for course materials",
                    "Comprehensive instructor and participant profiles",
                    "Real-time schedule management and updates"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-100 dark:bg-zinc-900 rounded-lg p-6 h-[320px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <p>Course Management Interface</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 md:flex-row-reverse">
              <div className="order-1 md:order-2">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Automated Training Processes</h2>
                <p className="text-muted-foreground mb-6">
                  Eliminate manual tasks and reduce errors with automated workflows for training registration, 
                  attendance tracking, and reporting.
                </p>
                <ul className="space-y-3">
                  {[
                    "Online submission and approval of training requests",
                    "Automated enrollment and registration management",
                    "Real-time attendance tracking with QR codes",
                    "Automated certificate generation and distribution"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-2 md:order-1 bg-slate-100 dark:bg-zinc-900 rounded-lg p-6 h-[320px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <p>Registration & Enrollment System</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Data Analytics & Reporting</h2>
                <p className="text-muted-foreground mb-6">
                  Gain valuable insights with comprehensive analytics and reporting capabilities
                  to measure training effectiveness and make data-driven decisions.
                </p>
                <ul className="space-y-3">
                  {[
                    "Real-time dashboards with key performance indicators",
                    "Customizable reports on attendance, completion rates, and costs",
                    "Training ROI analysis and visualization",
                    "Skills gap analysis and training needs identification"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-100 dark:bg-zinc-900 rounded-lg p-6 h-[320px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <p>Analytics Dashboard</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
              <div className="order-1 md:order-2">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Communication & Notifications</h2>
                <p className="text-muted-foreground mb-6">
                  Enhance stakeholder engagement with automated notifications and
                  seamless communication tools.
                </p>
                <ul className="space-y-3">
                  {[
                    "Automated reminders for upcoming training sessions",
                    "Deadline notifications and follow-ups",
                    "Performance updates and feedback collection",
                    "In-app and email communication channels"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-2 md:order-1 bg-slate-100 dark:bg-zinc-900 rounded-lg p-6 h-[320px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Bell className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <p>Notification System</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-slate-50 dark:bg-gradient-to-r dark:from-black dark:via-zinc-900 dark:to-gray-900 py-16">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Additional Features</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {additionalFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-background rounded-lg p-6 border dark:border-zinc-800 dark:shadow-md dark:shadow-black/30"
                >
                  <div className="bg-primary/10 p-3 inline-flex rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem-Solution Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Addressing Real OPD Challenges</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                OTMS directly addresses the critical challenges faced by Organizations of Persons with Disabilities (OPDs) in Rwanda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-100 dark:border-red-900/30">
                <h3 className="text-lg font-bold mb-4 text-red-700 dark:text-red-400">The Problem</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                    <div>
                      <p className="text-muted-foreground"><strong>24.29%</strong> of trainees require retraining due to ineffective training management</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                    <div>
                      <p className="text-muted-foreground"><strong>67%</strong> of training feedback goes uncollected, limiting improvement opportunities</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                    <div>
                      <p className="text-muted-foreground"><strong>15%</strong> of beneficiaries miss training due to manual communication processes</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-100 dark:border-green-900/30">
                <h3 className="text-lg font-bold mb-4 text-green-700 dark:text-green-400">The Solution</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                    <div>
                      <p className="text-muted-foreground">Structured training programs with progress tracking to ensure effective skill development</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                    <div>
                      <p className="text-muted-foreground">Automated feedback collection integrated into the training completion process</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                    <div>
                      <p className="text-muted-foreground">Timely notifications and reminders through multiple channels to ensure participation</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}

const additionalFeatures = [
  {
    title: "User Management",
    description: "Robust user registration, authentication, and role-based access control to ensure proper system usage.",
    icon: <Users className="h-6 w-6 text-primary" />
  },
  {
    title: "Course Catalog",
    description: "Comprehensive listing of available training courses with detailed descriptions and instructor information.",
    icon: <BookOpen className="h-6 w-6 text-primary" />
  },
  {
    title: "Training Requests",
    description: "Streamlined process for submitting and approving training requests with customizable approval workflows.",
    icon: <FileText className="h-6 w-6 text-primary" />
  },
  {
    title: "Attendance Tracking",
    description: "Real-time tracking of participant attendance with QR codes and digital check-ins.",
    icon: <CheckCircle2 className="h-6 w-6 text-primary" />
  },
  {
    title: "Resource Management",
    description: "Efficient allocation and management of training resources, venues, and materials.",
    icon: <Calendar className="h-6 w-6 text-primary" />
  },
  {
    title: "Accessibility Features",
    description: "Designed with accessibility in mind and compatible with assistive technologies like JAWS.",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />
  }
];
