import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSection } from '@/components/sections/ProblemSection'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { FeaturesGrid } from '@/components/sections/FeaturesGrid'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { AudienceSection } from '@/components/sections/AudienceSection'
import { GettingStartedSection } from '@/components/sections/GettingStartedSection'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQSection'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesGrid />
      <BenefitsSection />
      <AudienceSection />
      <GettingStartedSection />
      <CTASection />
      <FAQSection />
    </main>
  )
}