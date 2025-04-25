import Banner from "@/components/Banner/Banner";
import CategoryScroll from "@/components/categoryScroll/categoryScroll";
import CTASection from "@/components/CtaSection/CtaSection";
import ExclusiveProduct from "@/components/exclusive/ExclusiveProduct";
import FeaturedProduct from "@/components/featured/featuredProduct";
import Footer from "@/components/Footer/Footer";
import HeroQuote from "@/components/HeroQuote/HeroQuote";
import InstagramFeed from "@/components/InstagramFeed/InstagramFeed";
import Navbar from "@/components/Navbar/Navbar";
import Testimonials from "@/components/Testimonials/Testimonial";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import React from "react";

function MainHome() {
  return (
    <div>
      <div>
        <div>
          <Navbar />
        </div>
        <div>
          <Banner />
        </div>
        <div>
          <ExclusiveProduct />
        </div>
        <div>
          <FeaturedProduct />
        </div>
        {/* <div>
          <HeroQuote />
        </div> */}
        {/* <div>
          <CategoryScroll />
        </div> */}
        <div>
          <CTASection />
        </div>
        <div>
          <WhyChooseUs />
        </div>
        {/* <div>
          <Testimonials />
        </div> */}
        {/* <div>
          <InstagramFeed />
        </div> */}
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default MainHome;
