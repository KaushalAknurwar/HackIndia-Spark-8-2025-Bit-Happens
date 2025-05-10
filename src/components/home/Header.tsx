import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
      isScrolled ? 'bg-[#1A1A2E]/80 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-white font-['Comic Sans MS']">Zenith</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {["Home", "Features", "About", "Blog", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white/80 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          
          <Button
            onClick={() => navigate("/auth")}
            className="bg-white/10 backdrop-blur-md border border-white/20 
                     hover:bg-white/20 transition-all duration-300 text-white"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};