import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TargetAudience } from "@/components/target-audience";
import { ScissorsDivider } from "@/components/scissors-divider";
import { WorkFormat } from "@/components/work-format";
import { Specialization } from "@/components/specialization";
import { Process } from "@/components/process";
import { FAQ } from "@/components/faq";
import { ApplicationForm } from "@/components/application-form";
import { Blog } from "@/components/blog";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      
      {/* Scissors cut transition: black to cream */}
      <ScissorsDivider fromTheme="black" toTheme="cream" />
      
      <TargetAudience />
      
      {/* Scissors cut transition: cream to black */}
      <ScissorsDivider fromTheme="cream" toTheme="black" />
      
      <WorkFormat />
      <Specialization />
      
      {/* Scissors cut transition: cream to red */}
      <ScissorsDivider fromTheme="cream" toTheme="red" />
      
      <Process />
      <FAQ />
      <ApplicationForm />
      <Blog />
      <Contact />
      <Footer />
    </main>
  );
}
