import { useEffect, useRef, useState } from "react";
import * as animejs from "animejs";
import "./App.css";
import parentsPhoto from "./assets/parents.jpg";

// Create a callable wrapper named `anime` that delegates to the exported `animate`
// function while keeping other named exports attached (e.g. random, Timeline).
const anime = Object.assign((...args) => {
  // Support both calling conventions:
  // 1) anime(targets, params)
  // 2) anime({ targets, ...params }) — older single-object style
  if (args.length === 1 && args[0] && typeof args[0] === 'object' && Object.prototype.hasOwnProperty.call(args[0], 'targets')) {
    const { targets, ...rest } = args[0];
    return animejs.animate(targets, rest);
  }
  return animejs.animate(...args);
}, animejs);

// Add an alias for the older `timeline` method
anime.timeline = animejs.createTimeline;

export default function App() {
  const [loading, setLoading] = useState(true);
  const giftRef = useRef(null);
  const piecesRef = useRef([]);
  const [opened, setOpened] = useState(false);
  const [showLastSurprise, setShowLastSurprise] = useState(false);

  useEffect(() => {
    // Initial loader timeout
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      anime({
        targets: giftRef.current,
        translateY: [0, -20],
        alternate: true,
        loop: true,
        ease: "easeInOutQuad",
        duration: 1200,
      });
    }
  }, [loading]);

  const breakGift = () => {
    anime.timeline()
      .add(giftRef.current, {
        translateX: [0, -10, 10, -10, 10, 0],
        duration: 500,
      })
      .add(piecesRef.current, {
        opacity: [1, 0],
        translateX: () => anime.random(-200, 200),
        translateY: () => anime.random(-200, 200),
        rotate: () => anime.random(-360, 360),
        duration: 1200,
        ease: "easeOutExpo",
        onComplete: () => setOpened(true),
      });
  };

  useEffect(() => {
    if (opened) {
      anime.timeline()
        .add(".profile-pic", {
          opacity: [0, 1],
          scale: [0.5, 1],
          ease: "easeOutExpo",
          duration: 1000,
        })
        .add(".text1", {
          opacity: [0, 1],
          translateX: [-100, 0],
          ease: "easeOutExpo",
          duration: 1000,
        }, "-=600")

        .add(".text3", {
          opacity: [0, 1],
          translateY: [50, 0],
          ease: "easeOutExpo",
          duration: 1000,
        }, "-=600");

      createConfetti();
    }
  }, [opened]);

  useEffect(() => {
    if (showLastSurprise) {
      anime({
        targets: ".last-surprise",
        opacity: [0, 1],
        translateY: [100, 0],
        scale: [0.8, 1],
        ease: "easeOutExpo",
        duration: 1500,
      });
    }
  }, [showLastSurprise]);

  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starCount = 200;
    const newStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 15000 + 10000,
      delay: Math.random() * 10000,
      color: Math.random() > 0.5 ? '#fff' : (Math.random() > 0.5 ? '#a5f3fc' : '#c084fc'),
    }));
    setStars(newStars);
  }, []);

  const createConfetti = () => {
    const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ffffff'];
    for (let i = 0; i < 70; i++) {
      const div = document.createElement("div");
      div.className = "fixed w-2 h-2 rounded-full z-50 pointer-events-none";
      div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      div.style.top = "50%";
      div.style.left = "50%";
      document.body.appendChild(div);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 400 + 200;
      
      anime({
        targets: div,
        translateX: Math.cos(angle) * velocity,
        translateY: Math.sin(angle) * velocity,
        opacity: [1, 0],
        scale: [1, 0.5],
        rotate: () => anime.random(-360, 360),
        duration: 2000,
        ease: "easeOutExpo",
        onComplete: () => div.remove(),
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 animate-gradient text-white flex flex-col items-center ${opened ? 'justify-start md:justify-center pt-8 md:pt-0' : 'justify-center'} overflow-x-hidden relative selection:bg-purple-500/30 p-4`}>
      {/* Cinematic Loader */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-out">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
          </div>
          <p className="text-xl font-light tracking-[0.3em] text-indigo-300 animate-pulse uppercase">
            Preparing your surprise...
          </p>
        </div>
      )}

      {/* Dynamic Starfield */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            animation: `twinkle ${star.duration}ms infinite ease-in-out`,
            animationDelay: `${star.delay}ms`,
          }}
        />
      ))}
      
      {/* Cinematic Pulse Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2),transparent_80%)] pointer-events-none animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
      {!opened && (
        <div className="text-center cursor-pointer relative" onClick={breakGift}>
          <div
            ref={giftRef}
            className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 relative group"
          >
            {/* Pulsing Glow behind gift */}
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-3xl animate-pulse group-hover:bg-white/40 transition-colors" />
            <span className="text-7xl md:text-9xl select-none relative z-10">🎁</span>
          </div>
          <p className="mt-8 text-lg md:text-xl font-light tracking-[0.2em] md:tracking-widest text-gray-400 animate-pulse uppercase">
            Tap to open your surprise
          </p>

          {/* animated pieces (hidden initially) */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              ref={(el) => (piecesRef.current[i] = el)}
              className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 opacity-0 pointer-events-none"
              style={{ top: "40%", left: "45%" }}
            />
          ))}
        </div>
      )}

      {opened && (
        <div className="text-center space-y-6 md:space-y-8 max-w-2xl px-2">
          <div className="space-y-4 md:space-y-6">
            <div className="profile-pic opacity-0 flex justify-center">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                {/* Rotating Border Spinner */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-indigo-500 to-purple-500 animate-spin p-1">
                  <div className="w-full h-full rounded-full bg-black/50 backdrop-blur-sm" />
                </div>
                
                {/* Profile Image Container */}
                <div className="absolute inset-1 rounded-full border-2 border-white/10 shadow-2xl p-1 overflow-hidden">
                  <img 
                    src="https://media.licdn.com/dms/image/v2/D5603AQGfeEvvc2L_kA/profile-displayphoto-shrink_800_800/B56ZbDGgEtGsAc-/0/1747029984881?e=1775692800&v=beta&t=ZstzH8v0Kqr3GynAHRvSfaNGBuHl6l5PU0PqiWVhQcA" 
                    alt="Gopinath Profile"
                    className="w-full h-full object-cover rounded-full transition-transform hover:scale-110 duration-700"
                  />
                </div>
              </div>
            </div>
            <h1 className="text1 text-4xl md:text-6xl font-black opacity-0 tracking-tighter leading-tight">
              🎉 Happy Birthday 🎉 <br className="md:hidden" /> <span className="text-gradient">Gopinath</span> 
            </h1>
          </div>
          

          <h3 className="text3 text-lg md:text-2xl font-medium opacity-0 text-gray-400 italic px-4">
            "Turning cloud ideas into reality since 24 years" 
          </h3>

          <div className="pt-8">
            <button
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-blue-500/50 transition-all hover:-translate-y-1 active:scale-95 z-20"
              onClick={() => setShowLastSurprise(true)}
            >
              One more surprise...
            </button>
          </div>

          {showLastSurprise && (
            <div className="last-surprise opacity-0 mt-8 md:mt-12 mb-10 md:mb-20">
              <div className="relative group perspective-1000 w-full max-w-[280px] md:max-w-sm mx-auto">
                <div className="bg-white p-4 shadow-2xl rounded-sm transform transition-all duration-700 hover:rotate-2 hover:scale-105">
                  <div className="bg-gray-100 rounded-sm overflow-hidden mb-6 aspect-[4/5] relative">
                    <img 
                      src={parentsPhoto} 
                      alt="Parents" 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.3)] pointer-events-none" />
                  </div>
                  <p className="text-gray-800 text-3xl font-black italic text-center tracking-tighter" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    "The pillars of our growth" ❤️
                  </p>
                </div>
                {/* Decorative floating hearts or glow */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-pink-500 rounded-full blur-2xl opacity-40 animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse" />
              </div>
              <p className="mt-8 text-xl text-indigo-300 font-medium italic animate-bounce">
                A big thanks to the best parents! 💙
              </p>
            </div>
          )}

          <div className="text3 mt-12 md:mt-20 text-center max-w-md mx-auto opacity-0 px-4">
            <h2 className="text-xl md:text-2xl mb-2 font-bold text-gradient">About Him</h2>
            <p className="text-sm md:text-lg text-gray-400 leading-relaxed pb-10">
              Passionate Salesforce Developer, specialized in building powerful enterprise solutions and pushing the boundaries of the cloud 🚀
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
