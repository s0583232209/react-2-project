export default function Loading({ message }) {
  return (
    <>
      <style>{`
        @keyframes butterfly {
          0%, 100% {
            transform: translateY(0) rotate(-5deg);
          }
          25% {
            transform: translateY(-15px) rotate(5deg);
          }
          50% {
            transform: translateY(-5px) rotate(-5deg);
          }
          75% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes pulse-dot {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-butterfly {
          animation: butterfly 3s ease-in-out infinite;
        }

        .animate-pulse-1 {
          animation: pulse-dot 1.4s ease-in-out infinite;
        }

        .animate-pulse-2 {
          animation: pulse-dot 1.4s ease-in-out 0.2s infinite;
        }

        .animate-pulse-3 {
          animation: pulse-dot 1.4s ease-in-out 0.4s infinite;
        }
      `}</style>

      <div
        className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[9999]"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-butterfly" style={{fontSize:"200px",marginTop:"200px"}}>🦋</div>
          <p className="text-lg text-teal-700 font-medium mb-3">{message}</p>
          <div className="flex gap-2 justify-center">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse-1"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse-2"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse-3"></div>
          </div>
        </div>
      </div>
    </>
  );
}
