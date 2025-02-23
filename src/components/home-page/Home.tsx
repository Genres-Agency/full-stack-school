import Header from "./Header";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import Footer from "../shared/Footer";


const Home = () => {
  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50">
      <Header />
      </div>
      <main>
        <HeroSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
