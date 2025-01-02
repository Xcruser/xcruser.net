export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-100">
      <header className="w-full max-w-7xl mx-auto text-center px-6 py-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-sky-400 sm:text-6xl">
          Xcruser.net
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
          Your go-to platform for professional and detailed documentation, tutorials, and step-by-step guides for home lab enthusiasts.
        </p>
      </header>
      <section className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8 mt-6">
        <h2 className="text-2xl font-semibold text-sky-300 mb-4">
          Why Choose Us?
        </h2>
        <p className="text-gray-300 text-base leading-relaxed">
          Dive into our collection of resources tailored for network engineers, IoT developers, and data storage experts. 
          Every guide is meticulously crafted to simplify complex concepts and empower your technical journey.
        </p>
      </section>
      <div className="w-full max-w-7xl mx-auto flex flex-wrap gap-6 mt-12 px-6">
        <div className="flex-1 bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-xl font-bold text-sky-400 mb-2">Step-by-Step Guides</h3>
          <p className="text-gray-300 text-sm">
            Explore comprehensive guides covering networking, storage, and automation.
          </p>
        </div>
        <div className="flex-1 bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-xl font-bold text-sky-400 mb-2">Tailored Tutorials</h3>
          <p className="text-gray-300 text-sm">
            Tutorials crafted for all experience levels, from beginner to expert.
          </p>
        </div>
        <div className="flex-1 bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-xl font-bold text-sky-400 mb-2">Project Insights</h3>
          <p className="text-gray-300 text-sm">
            Learn from real-world projects and enhance your problem-solving skills.
          </p>
        </div>
      </div>
      <footer className="w-full max-w-7xl mx-auto mt-16 text-center text-sm text-gray-500 py-8 border-t border-gray-700">
        © 2025 Xcruser.net. Empowering Home Lab Enthusiasts.
      </footer>
    </main>
  );
}
