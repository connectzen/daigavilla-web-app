import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { WhyChooseSection } from "@/components/why-choose-section"
import { TeamSection } from "@/components/team-section"
import { ProjectsSection } from "@/components/projects-section"
import { OngoingProjectSection } from "@/components/ongoing-project-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { VideoGallerySection } from "@/components/video-gallery-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <OngoingProjectSection />
      <ProjectsSection />
      <VideoGallerySection />
      <AboutSection />
      <WhyChooseSection />
      <TeamSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
