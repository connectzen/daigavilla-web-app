"use client"

// Hero background now uses a local static image for faster load

export function HeroSection() {
  const heroBackgroundImage = "/hellosectionimage/IMG-20250711-WA0005.jpg"

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-end md:items-center justify-center pb-24 md:pb-0 overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-accent"
    >
      {heroBackgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackgroundImage})` }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mt-0 md:mt-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom duration-700">
            Welcome to <span className="text-accent">DAIGAVILLA Ltd</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
            Your Trusted Partner in Construction and Real Estate
          </p>
          {/* CTAs removed per request to reveal more of the image */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
