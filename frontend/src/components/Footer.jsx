export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-8">
        <p className="text-center text-sm md:text-base text-gray-500/80 font-medium tracking-wide">
          Copyright {new Date().getFullYear()} © ResumeAnalyzer.dev. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}