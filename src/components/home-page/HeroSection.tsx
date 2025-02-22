import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative min-h-[400px] flex items-center justify-center bg-gray-800 text-white mt-5">
      <Image src="/abcd.jpg" alt="Campus" fill className="opacity-50 object-cover" />
      <div className="absolute text-center">
        <h1 className="text-4xl font-bold">Welcome to Gen School</h1>
        <p className="text-lg mt-2">Innovation • Creation • Leadership</p>
      </div>
    </section>
  );
};

export default HeroSection;
