import { Footer } from "@/components/layout/footer";
import NavigationBar from "@/components/layout/home/nav";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experiences";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/projects";

export default function Home() {
  return (
    <>
    
      {/* Main avec background dynamique */}
      <main className="mt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden min-h-screen transition-colors duration-500">
        {/* Effet de lumière subtil avec couleur primaire */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <NavigationBar />
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}