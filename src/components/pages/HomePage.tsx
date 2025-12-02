// HPI 1.6-V
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { 
  Briefcase, 
  FileText, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Search, 
  Bell, 
  Shield, 
  Zap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

// --- UTILITY COMPONENTS ---

/**
 * Mandatory Intersection Observer Component for Scroll Reveals
 * Implements the "Unfolding Narrative" pattern safely.
 */
type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ 
  children, 
  className, 
  delay = 0, 
  threshold = 0.1 
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Add a small delay via style if needed, or just class
        setTimeout(() => {
            element.classList.add('is-visible');
        }, delay);
        observer.unobserve(element);
      }
    }, { threshold });

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div 
      ref={ref} 
      className={`opacity-0 translate-y-8 transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${className || ''}`}
    >
      <style>{`
        .is-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
      {children}
    </div>
  );
};

/**
 * Parallax Container
 * Uses CSS variables driven by scroll position for high-performance parallax
 */
const ParallaxSection: React.FC<{ children: React.ReactNode; speed?: number; className?: string }> = ({ 
  children, 
  speed = 0.5, 
  className 
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollProgress = 1 - (rect.bottom / (window.innerHeight + rect.height));
      // Only update if in view to save resources
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        ref.current.style.setProperty('--scroll-offset', `${scrollProgress * 100 * speed}px`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`} style={{ transform: 'translateY(var(--scroll-offset, 0px))' }}>
      {children}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.05 && !isScrolled) setIsScrolled(true);
    if (latest <= 0.05 && isScrolled) setIsScrolled(false);
  });

  return (
    <div className="min-h-screen bg-secondary text-secondary-foreground overflow-clip selection:bg-primary selection:text-primary-foreground font-paragraph">
      
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Navigation - Floating Pill Style */}
      <header className={`fixed top-6 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${isScrolled ? 'py-0' : 'py-2'}`}>
        <nav className={`
          flex items-center gap-2 md:gap-8 px-6 py-3 rounded-full transition-all duration-500
          ${isScrolled 
            ? 'bg-secondary/80 backdrop-blur-md border border-white/10 shadow-2xl translate-y-0' 
            : 'bg-primary text-primary-foreground translate-y-2 shadow-xl'}
        `}>
          <Link to="/" className="flex items-center gap-2 mr-4 group">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isScrolled ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className={`font-heading font-bold text-lg tracking-tight ${isScrolled ? 'text-secondary-foreground' : 'text-primary-foreground'}`}>
              JobTrack
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { name: 'Dashboard', path: '/dashboard' },
              { name: 'Applications', path: '/applications' },
              { name: 'Resumes', path: '/resumes' }
            ].map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isScrolled 
                    ? 'text-secondary-foreground/70 hover:text-primary hover:bg-white/5' 
                    : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-black/10'}
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pl-4 border-l border-current/10 ml-2">
             <Link to="/dashboard">
              <Button 
                size="sm" 
                className={`
                  rounded-full px-6 font-heading tracking-wide transition-all
                  ${isScrolled 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'}
                `}
              >
                Login
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO SECTION - Immersive, Dark, Full Bleed */}
      <section className="relative w-full min-h-[110vh] flex flex-col justify-center items-center pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(190,235,0,0.15),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-brandaccent/5 rounded-full blur-[120px]" />
        </div>

        <div className="container max-w-[120rem] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
          
          {/* Hero Text Content */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-10">
            <AnimatedElement>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm w-fit">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium tracking-wider uppercase text-primary">v2.0 Now Live</span>
              </div>
            </AnimatedElement>
            
            <div className="space-y-4">
              <AnimatedElement delay={100}>
                <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight text-secondary-foreground">
                  Clean <br />
                  <span className="text-primary">Fresh Air</span> <br />
                  For Your <br />
                  Career.
                </h1>
              </AnimatedElement>
              
              <AnimatedElement delay={200}>
                <p className="font-paragraph text-xl text-secondary-foreground/60 max-w-md leading-relaxed mt-6 border-l-2 border-primary/30 pl-6">
                  Stop the spreadsheet chaos. Organize your entire job search journey in one beautiful, intelligent workspace designed for freshers.
                </p>
              </AnimatedElement>
            </div>

            <AnimatedElement delay={300}>
              <div className="flex flex-wrap gap-4 items-center">
                <Link to="/dashboard">
                  <Button size="lg" className="h-16 px-10 rounded-full bg-primary text-primary-foreground hover:bg-brandaccent text-lg font-heading transition-all hover:scale-105">
                    Start Tracking Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <div className="flex -space-x-4 pl-4">
                  {[1,2,3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-secondary bg-zinc-800 flex items-center justify-center text-xs text-white/50">
                      <span className="sr-only">User {i}</span>
                      UI
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-secondary bg-zinc-800 flex items-center justify-center text-xs text-white font-medium pl-1">
                    +2k
                  </div>
                </div>
              </div>
            </AnimatedElement>
          </div>

          {/* Hero Visual - Parallax & Depth */}
          <div className="lg:col-span-7 relative h-[60vh] lg:h-[80vh] w-full">
            <ParallaxSection speed={0.2} className="absolute inset-0 z-10">
               <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-sm group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 z-10 pointer-events-none" />
                  <Image
                    src="https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=hero-main-dashboard"
                    alt="JobTrack Dashboard Interface"
                    width={1400}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  
                  {/* Floating UI Elements */}
                  <div className="absolute top-12 right-12 z-20 bg-secondary/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl max-w-xs transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Offer Received</p>
                        <p className="text-xs text-white/50">Google • UX Designer</p>
                      </div>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-green-500" />
                    </div>
                  </div>

                  <div className="absolute bottom-20 left-12 z-20 bg-white text-secondary p-6 rounded-2xl shadow-2xl max-w-xs transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-4xl font-heading font-bold">12</span>
                      <span className="text-sm font-medium text-zinc-500 mb-1">Interviews</span>
                    </div>
                    <p className="text-xs text-zinc-400">This week's activity</p>
                  </div>
               </div>
            </ParallaxSection>
          </div>
        </div>
      </section>

      {/* TICKER SECTION - Infinite Scroll */}
      <section className="w-full bg-primary py-6 overflow-hidden border-y border-black/10">
        <div className="flex whitespace-nowrap">
          <motion.div 
            className="flex gap-16 items-center"
            animate={{ x: "-50%" }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 items-center">
                {["APPLICATION SENT", "INTERVIEW SCHEDULED", "OFFER RECEIVED", "RESUME UPDATED", "SKILL ADDED", "GOAL REACHED"].map((text, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-primary-foreground font-heading font-bold text-2xl tracking-wider">{text}</span>
                    <div className="w-3 h-3 bg-primary-foreground rounded-full" />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION - Sticky Scroll Narrative */}
      <section className="w-full bg-background text-foreground py-32 px-6 rounded-t-[4rem] -mt-12 relative z-20">
        <div className="max-w-[100rem] mx-auto">
          <div className="text-center mb-32">
            <AnimatedElement>
              <h2 className="font-heading text-5xl md:text-7xl text-secondary mb-8">
                The Job Hunt <br />
                <span className="text-primary-foreground/40 italic font-serif">Doesn't Have To Be</span> <br />
                A Nightmare.
              </h2>
            </AnimatedElement>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* Sticky Left Side */}
            <div className="hidden lg:block h-fit sticky top-32">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary p-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="relative z-10 text-center space-y-6">
                  <div className="w-24 h-24 bg-primary rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(190,235,0,0.3)]">
                    <Shield className="w-10 h-10 text-secondary" />
                  </div>
                  <h3 className="text-3xl font-heading text-white">Your Command Center</h3>
                  <p className="text-white/60 max-w-xs mx-auto">
                    One secure place for every document, date, and detail. No more lost emails.
                  </p>
                </div>
                
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-brandaccent/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              </div>
            </div>

            {/* Scrolling Right Side */}
            <div className="space-y-32 pt-12">
              {[
                {
                  icon: <Search className="w-8 h-8" />,
                  title: "Track Applications",
                  desc: "Log every role you apply for. Keep tabs on company names, job titles, and current status in real-time.",
                  stat: "100%",
                  statLabel: "Visibility"
                },
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: "Version Control",
                  desc: "Maintain multiple versions of your resume. Tailor your CV for specific industries and never send the wrong file again.",
                  stat: "∞",
                  statLabel: "Versions"
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "Visual Analytics",
                  desc: "See your progress at a glance. Our dashboard turns your activity into clear, actionable insights.",
                  stat: "24/7",
                  statLabel: "Insights"
                }
              ].map((item, idx) => (
                <AnimatedElement key={idx} threshold={0.5}>
                  <div className="group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-subtlebackground flex items-center justify-center text-secondary group-hover:bg-primary transition-colors duration-500">
                        {item.icon}
                      </div>
                      <div className="h-px flex-1 bg-secondary/10" />
                      <span className="font-heading text-4xl text-secondary/20 font-bold">0{idx + 1}</span>
                    </div>
                    
                    <h3 className="text-4xl font-heading text-secondary mb-6 group-hover:translate-x-2 transition-transform duration-300">
                      {item.title}
                    </h3>
                    <p className="text-xl text-secondary/70 leading-relaxed mb-8 max-w-md">
                      {item.desc}
                    </p>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-primary">{item.stat}</span>
                      <span className="text-sm font-medium text-secondary/50 uppercase tracking-widest">{item.statLabel}</span>
                    </div>
                  </div>
                </AnimatedElement>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SHOWCASE - Full Width Cards */}
      <section className="w-full bg-secondary py-32 px-6 overflow-hidden">
        <div className="max-w-[120rem] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <AnimatedElement>
              <h2 className="font-heading text-5xl md:text-6xl text-white">
                Built for the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brandaccent">Modern Candidate</span>
              </h2>
            </AnimatedElement>
            <AnimatedElement delay={200}>
              <Link to="/applications">
                <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white hover:text-secondary px-8 py-6 text-lg">
                  Explore All Features
                </Button>
              </Link>
            </AnimatedElement>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <AnimatedElement delay={0} className="h-full">
              <div className="bg-zinc-900 rounded-[2.5rem] p-8 h-[600px] flex flex-col relative overflow-hidden group border border-white/5 hover:border-primary/50 transition-colors duration-500">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-heading text-white mb-2">Smart Reminders</h3>
                  <p className="text-white/50">Never miss a follow-up or interview.</p>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-3/4 translate-y-12 group-hover:translate-y-8 transition-transform duration-500">
                  <Image 
                    src="https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=feature-reminders"
                    alt="Reminders UI"
                    width={600}
                    className="w-full h-full object-cover object-top rounded-t-2xl shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </AnimatedElement>

            {/* Card 2 - Featured */}
            <AnimatedElement delay={150} className="h-full">
              <div className="bg-primary rounded-[2.5rem] p-8 h-[600px] flex flex-col relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-heading text-secondary mb-2">Timeline View</h3>
                  <p className="text-secondary/70">Visualize your journey chronologically.</p>
                </div>
                
                <div className="absolute bottom-8 left-8 right-8 top-48 bg-secondary rounded-2xl p-6 shadow-2xl transform group-hover:scale-105 transition-transform duration-500 flex flex-col justify-center items-center">
                   <div className="w-full space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <div className="h-2 w-24 bg-white/20 rounded-full" />
                          <div className="h-2 w-12 bg-white/10 rounded-full ml-auto" />
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </AnimatedElement>

            {/* Card 3 */}
            <AnimatedElement delay={300} className="h-full">
              <div className="bg-zinc-900 rounded-[2.5rem] p-8 h-[600px] flex flex-col relative overflow-hidden group border border-white/5 hover:border-primary/50 transition-colors duration-500">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-brandaccent/20 flex items-center justify-center text-brandaccent mb-6">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-heading text-white mb-2">Job Details</h3>
                  <p className="text-white/50">Deep dive into every opportunity.</p>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-3/4 translate-x-12 translate-y-12 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-500">
                  <Image 
                    src="https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=feature-details"
                    alt="Job Details UI"
                    width={600}
                    className="w-full h-full object-cover object-top rounded-tl-2xl shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Massive Impact */}
      <section className="w-full bg-background py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[100px]" />
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brandaccent/30 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <AnimatedElement>
            <h2 className="font-heading text-6xl md:text-8xl lg:text-9xl text-secondary tracking-tighter mb-12">
              Ready to <br />
              <span className="text-primary relative inline-block">
                Launch?
                <svg className="absolute -bottom-4 left-0 w-full h-4 text-secondary/10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h2>
          </AnimatedElement>

          <AnimatedElement delay={200}>
            <p className="text-xl md:text-2xl text-secondary/60 max-w-2xl mx-auto mb-16">
              Join thousands of freshers who have turned their job search into a science. No credit card required.
            </p>
          </AnimatedElement>

          <AnimatedElement delay={400}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link to="/dashboard">
                <Button size="lg" className="h-20 px-12 rounded-full bg-secondary text-white hover:bg-secondary/90 text-xl font-heading shadow-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  Get Started Now
                </Button>
              </Link>
              <Link to="/applications">
                <Button variant="ghost" size="lg" className="h-20 px-12 rounded-full text-secondary hover:bg-secondary/5 text-xl font-heading">
                  View Demo
                </Button>
              </Link>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* FOOTER - Clean & Functional */}
      <footer className="bg-secondary text-white py-24 px-6 border-t border-white/10">
        <div className="max-w-[120rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-secondary">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-heading font-bold text-2xl">JobTrack</span>
            </Link>
            <p className="text-white/50 max-w-md text-lg">
              Empowering the next generation of professionals with tools that bring clarity to the chaos of job hunting.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="font-heading text-lg text-primary">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/dashboard" className="text-white/60 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/applications" className="text-white/60 hover:text-white transition-colors">Applications</Link></li>
              <li><Link to="/resumes" className="text-white/60 hover:text-white transition-colors">Resume Builder</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-heading text-lg text-primary">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-[120rem] mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-sm">
          <p>© 2025 JobTrack Inc. All rights reserved.</p>
          <p>Designed with precision.</p>
        </div>
      </footer>
    </div>
  );
}