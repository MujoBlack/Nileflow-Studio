import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SiteLayout from "@/components/feature/SiteLayout";
import Hero from "@/pages/home/components/Hero";
import MarqueeBand from "@/pages/home/components/MarqueeBand";
import StudioTour from "@/pages/home/components/StudioTour";
import WhyUs from "@/pages/home/components/WhyUs";
import SessionsSection from "@/pages/home/components/SessionsSection";
import ServicesSection from "@/pages/home/components/ServicesSection";
import RecentWork from "@/pages/home/components/RecentWork";
import TeamSection from "@/pages/home/components/TeamSection";
import ReviewsSection from "@/pages/home/components/ReviewsSection";
import FaqSection from "@/pages/home/components/FaqSection";
import FinalCta from "@/pages/home/components/FinalCta";
import BookingPanel from "@/components/booking/BookingPanel";
import QuotePanel from "@/components/quote/QuotePanel";
import PhotoTour from "@/components/feature/PhotoTour";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const bookOpen = location.pathname === "/book";
  const quoteOpen = location.pathname === "/quote";

  const closePanel = () => navigate("/");

  return (
    <>
      <SiteLayout>
        <Hero />
        <MarqueeBand />
        <StudioTour />
        <WhyUs />
        <SessionsSection />
        <ServicesSection />
        <RecentWork />
        <TeamSection />
        <ReviewsSection />
        <FaqSection />
        <FinalCta />
      </SiteLayout>

      <BookingPanel
        open={bookOpen}
        initialSessionId={params.get("session")}
        onClose={closePanel}
      />
      <QuotePanel
        open={quoteOpen}
        initialService={params.get("service")}
        onClose={closePanel}
      />
      <PhotoTour />
    </>
  );
}