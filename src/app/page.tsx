
// import { Projects } from '@/components/sections/Projects';
// import { Experience } from '@/components/sections/Experience';
// import { Contact } from '@/components/sections/Contact';

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
      <NavigationBar />
      <main className='mt-25 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden min-h-screen'>
        
        <Hero />
        <About />
        {/* <Projects /> */}
        {/* <Experience /> */}
        {/* <Contact /> */}

        <Projects />
        
        <Experience />
        <Contact />
        
        
      </main>
      <Footer />
    </>
  );
}
