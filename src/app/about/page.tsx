import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-50 dark:bg-gradient-to-b dark:from-black dark:to-zinc-900 py-12 md:py-24">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">About OTMS</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Organization Trainings Management System for OPDs: Enhancing Training Processes, 
                Decision-Making, and Bridging Beneficiaries Skill Gaps
              </p>
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-12 md:py-24">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Project Overview</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="mb-4">
                    In today's fast-paced and competitive business environment, continuous learning 
                    through effective training and development programs is essential for equipping 
                    beneficiaries with the skills required to excel in their roles and contribute to 
                    organizational success.
                  </p>
                  <p className="mb-4">
                    Many organizations face challenges in managing training programs, including scattered data, 
                    inefficient processes, and limited insights for informed decision-making. These challenges 
                    are particularly experienced in Rwanda, where organizations are working to bridge workforce 
                    skill gaps and align with the nation's Vision 2050 goals for economic transformation.
                  </p>
                  <p>
                    Our Organization Training Management System (OTMS) addresses these challenges by providing 
                    a centralized platform for Organizations of People with Disabilities (OPDs) to manage 
                    training programs efficiently.
                  </p>
                </div>
              </div>
              <div className="bg-slate-100 dark:bg-zinc-900 rounded-lg p-6 border dark:border-zinc-800 dark:shadow-md dark:shadow-black/30">
                <h3 className="text-xl font-bold mb-4">Key Challenges We're Solving</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                    <div>
                      <span className="font-semibold">Scattered Data</span>
                      <p className="text-sm text-muted-foreground">Centralizing training information in one accessible platform</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                    <div>
                      <span className="font-semibold">Inefficient Processes</span>
                      <p className="text-sm text-muted-foreground">Automating manual tasks to reduce errors and save time</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                    <div>
                      <span className="font-semibold">Poor Communication</span>
                      <p className="text-sm text-muted-foreground">Enhancing stakeholder communication through automated notifications</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">4</span>
                    <div>
                      <span className="font-semibold">Limited Analytics</span>
                      <p className="text-sm text-muted-foreground">Providing data-driven insights for informed decision-making</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Our Vision */}
        <section className="bg-slate-50 dark:bg-gradient-to-b dark:from-black dark:to-zinc-900 py-12 md:py-24">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We aim to empower Organizations of People with Disabilities to improve workforce 
                development, foster innovation, and contribute to sustainable socioeconomic growth.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-background rounded-lg p-6 shadow-sm border dark:border-zinc-800 dark:shadow-md dark:shadow-black/30">
                <h3 className="text-xl font-bold mb-3">Streamlined Processes</h3>
                <p className="text-muted-foreground">
                  OTMS will enable OPDs to streamline training processes, track beneficiaries progress, 
                  and evaluate training effectiveness through advanced reporting and analytics.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-sm border dark:border-zinc-800 dark:shadow-md dark:shadow-black/30">
                <h3 className="text-xl font-bold mb-3">Data-Driven Insights</h3>
                <p className="text-muted-foreground">
                  By leveraging data-driven insights, the system will support informed decision-making, 
                  ensuring that training programs are aligned with organizational goals.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-sm border dark:border-zinc-800 dark:shadow-md dark:shadow-black/30">
                <h3 className="text-xl font-bold mb-3">Bridging Skill Gaps</h3>
                <p className="text-muted-foreground">
                  Our system effectively bridges beneficiaries skill gaps and contributes to Rwanda's 
                  Vision 2050 goals for economic transformation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Team */}
        <section className="py-12 md:py-24">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Meet The Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our project is being developed by passionate students from the College of Science 
                and Technology, School of Information and Communication Technology.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-slate-200 dark:bg-zinc-900 rounded-full w-32 h-32 mx-auto mb-4 border dark:border-zinc-800 dark:shadow-md dark:shadow-black/30"></div>
                <h3 className="text-lg font-bold">Gacamumakuba David</h3>
                <p className="text-muted-foreground text-sm">Student ID: 221010521</p>
              </div>
              <div className="text-center">
                <div className="bg-slate-200 dark:bg-zinc-900 rounded-full w-32 h-32 mx-auto mb-4 border dark:border-zinc-800 dark:shadow-md dark:shadow-black/30"></div>
                <h3 className="text-lg font-bold">Umutoniwase Doreen</h3>
                <p className="text-muted-foreground text-sm">Student ID: 221021732</p>
              </div>
              <div className="text-center">
                <div className="bg-slate-200 dark:bg-zinc-900 rounded-full w-32 h-32 mx-auto mb-4 border dark:border-zinc-800 dark:shadow-md dark:shadow-black/30"></div>
                <h3 className="text-lg font-bold">Niyogisubizo Habarurema Johovanis</h3>
                <p className="text-muted-foreground text-sm">Student ID: 221020951</p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-lg font-bold">Supervisor</h3>
              <p className="text-muted-foreground">Mr. Harelimana Dominique, Lecturer</p>
            </div>
          </div>
        </section>

        {/* Academic Details */}
        {/* <section className="bg-slate-50 dark:bg-slate-900 py-12">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Project Details</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg border">
                  <dt className="text-sm font-medium text-muted-foreground">Institution</dt>
                  <dd className="font-semibold">College of Science and Technology</dd>
                </div>
                <div className="bg-background p-4 rounded-lg border">
                  <dt className="text-sm font-medium text-muted-foreground">School</dt>
                  <dd className="font-semibold">School of Information and Communication Technology</dd>
                </div>
                <div className="bg-background p-4 rounded-lg border">
                  <dt className="text-sm font-medium text-muted-foreground">Project Type</dt>
                  <dd className="font-semibold">Final Year Project</dd>
                </div>
                <div className="bg-background p-4 rounded-lg border">
                  <dt className="text-sm font-medium text-muted-foreground">Academic Year</dt>
                  <dd className="font-semibold">2024/2025</dd>
                </div>
                <div className="bg-background p-4 rounded-lg border">
                  <dt className="text-sm font-medium text-muted-foreground">Submission Date</dt>
                  <dd className="font-semibold">7 February 2025</dd>
                </div>
                <div className="bg-background p-4 rounded-lg border">
                  <dt className="text-sm font-medium text-muted-foreground">Technology Stack</dt>
                  <dd className="font-semibold">MERN (MongoDB, Express.js, React.js, Node.js)</dd>
                </div>
              </dl>
            </div>
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  )
}