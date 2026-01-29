"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background:
            "linear-gradient(135deg, #0A0F1C 0%, #1E3A5F 50%, #0A0F1C 100%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating Orb 1 - Blue, top-left */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl animate-float opacity-30"
        style={{
          backgroundColor: "#3B82F6",
          top: "-10%",
          left: "-5%",
        }}
      />

      {/* Floating Orb 2 - Purple, bottom-right */}
      <div
        className="absolute w-80 h-80 rounded-full blur-3xl animate-float-delayed opacity-20"
        style={{
          backgroundColor: "#8B5CF6",
          bottom: "-10%",
          right: "-5%",
        }}
      />

      {/* Floating Orb 3 - Cyan, bottom-left area */}
      <div
        className="absolute w-72 h-72 rounded-full blur-3xl animate-float-slow opacity-25"
        style={{
          backgroundColor: "#06B6D4",
          bottom: "20%",
          left: "10%",
        }}
      />

      {/* Floating Orb 4 - Green, top-right area */}
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl animate-float opacity-15"
        style={{
          backgroundColor: "#10B981",
          top: "15%",
          right: "15%",
          animationDelay: "-15s",
        }}
      />
    </div>
  );
}
