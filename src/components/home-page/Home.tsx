import Head from "next/head";
import Header from "./Header";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import Footer from "../shared/Footer";


const Home = () => {
  return (
    <>
      <Head>
        <title>Gen School</title>
        <meta name="description" content="Official website of Gen School" />
      </Head>
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
