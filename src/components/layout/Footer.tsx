const Footer = () => {
  return (
    <footer className="w-full bg-purple-700 text-green-100 text-sm px-4 py-4 ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <div className="text-center md:text-left">
          &copy; {new Date().getFullYear()} <span className="text-white font-semibold">Brand</span>. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <a href="/privacy" className="hover:text-white transition">Privacy</a>
          <a href="/terms" className="hover:text-white transition">Terms</a>
          <a href="/contact" className="hover:text-white transition">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
