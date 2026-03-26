import apiClient from './client'

export interface PromoBannerDto {
  text: string
  ctaText?: string
  ctaUrl?: string
}

export interface FeaturedCompanyDto {
  name: string
  logoUrl?: string
}

export interface FeatureCardDto {
  title: string
  description: string
  buttonText?: string
  buttonUrl?: string
  iconName?: string
  imageUrl?: string
  extraData?: string
}

export interface TestimonialDto {
  name: string
  title: string
  company: string
  quote: string
  profileImageUrl?: string
  videoUrl?: string
  twitterUrl?: string
  linkedInUrl?: string
}

export interface TopicDto {
  name: string
  iconUrl?: string
}

export interface PlanFeatureDto {
  text: string
}

export interface PricingPlanDto {
  name: string
  monthlyPrice: number
  yearlyPrice?: number
  yearlyDiscountPercent?: number
  isHighlighted: boolean
  buttonText?: string
  buttonUrl?: string
  features: PlanFeatureDto[]
}

export interface RoleDto {
  name: string
  slug: string
  url?: string
}

export interface FooterLinkDto {
  category: string
  label: string
  url: string
}

export interface SocialLinkDto {
  platform: string
  url: string
}

export interface LandingPageDto {
  promoBanners: PromoBannerDto[]
  content: Record<string, string>
  stats: Record<string, string>
  featuredCompanies: FeaturedCompanyDto[]
  featureCardsHowItHelps: FeatureCardDto[]
  featureCardsMoreFeatures: FeatureCardDto[]
  testimonials: TestimonialDto[]
  topics: TopicDto[]
  pricingPlans: PricingPlanDto[]
  roles: RoleDto[]
  footerLinks: FooterLinkDto[]
  socialLinks: SocialLinkDto[]
}

export const landingApi = {
  getLandingPage: async (): Promise<LandingPageDto> => {
    const res = await apiClient.get<{
      promoBanners: PromoBannerDto[]
      content: Record<string, string>
      stats: Record<string, string>
      featuredCompanies: FeaturedCompanyDto[]
      featureCardsHowItHelps: FeatureCardDto[]
      featureCardsMoreFeatures: FeatureCardDto[]
      testimonials: TestimonialDto[]
      topics: TopicDto[]
      pricingPlans: PricingPlanDto[]
      roles: RoleDto[]
      footerLinks: FooterLinkDto[]
      socialLinks: SocialLinkDto[]
    }>('/landing')
    const d = res.data
    return {
      promoBanners: d.promoBanners ?? [],
      content: d.content ?? {},
      stats: d.stats ?? {},
      featuredCompanies: d.featuredCompanies ?? [],
      featureCardsHowItHelps: d.featureCardsHowItHelps ?? [],
      featureCardsMoreFeatures: d.featureCardsMoreFeatures ?? [],
      testimonials: d.testimonials ?? [],
      topics: d.topics ?? [],
      pricingPlans: d.pricingPlans ?? [],
      roles: d.roles ?? [],
      footerLinks: d.footerLinks ?? [],
      socialLinks: d.socialLinks ?? [],
    }
  },
  subscribeNewsletter: async (email: string): Promise<{ message: string }> => {
    const res = await apiClient.post<{ message: string }>('/landing/newsletter', { email })
    return res.data
  },
}
