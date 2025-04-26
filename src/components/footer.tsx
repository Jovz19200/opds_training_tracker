import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container  mx-auto max-w-7xl px-4 sm:px-8 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">OTMS</h3>
            <p className="text-sm text-muted-foreground">
              Organization Trainings Management System for OPDs - Enhancing Training 
              Processes and Decision-Making
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/documentation" className="text-sm text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>College of Science and Technology</li>
              <li>School of ICT</li>
              <li>Kigali, Rwanda</li>
              <li>info@otms.rw</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Organization Trainings Management System. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Developed by Gacamumakuba David, Umutoniwase Doreen & Niyogisubizo Habarurema Johovanis
          </p>
        </div>
      </div>
    </footer>
  )
} 