import {
  Home,
  Github,
  Twitter,
  Calendar,
  MessageCircle,
  Settings,
  MoreHorizontal,
  BellOff,
  Forward,
} from 'lucide-react';

const Contact = () => {
  
  return (
    <div className="flex flex-grow bg-yellow-900 text-white">
      
      <aside className="w-64 bg-yellow-950 flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-yellow-800">Browse</div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            <li className="px-4 py-2 flex items-center hover:bg-yellow-900 cursor-pointer">
              <Home className="w-5 h-5 mr-2" /> Live Channels
            </li>
            <li className="px-4 py-2 flex items-center hover:bg-yellow-900 cursor-pointer">
              <Home className="w-5 h-5 mr-2" /> Asset Packages
            </li>
            {/* Channel Items */}
            <li className="px-4 py-2 flex items-center justify-between hover:bg-yellow-900 cursor-pointer">
              <div className="flex items-center">
                <img src="https://loremflickr.com/1280/720" alt="Gaules" className="w-6 h-6 rounded-full mr-2" />
                Gaules
              </div>
              <span className="text-yellow-400 text-sm">30.3K</span>
            </li>
          </ul>
          <button className="w-full py-2 text-center text-sm hover:bg-yellow-900">Show More</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header Banner */}
        <div className="h-40 bg-black flex items-center justify-center">
          <BellOff className="w-12 h-12 text-red-600 animate-pulse" />
        </div>

        {/* Profile Section */}
        <div className="p-6 grid grid-cols-3 gap-4 border-b border-yellow-800">
          <div className="col-span-2">
            <h1 className="text-2xl font-bold flex items-center">
              Tsoding <MoreHorizontal className="w-5 h-5 ml-2" />
            </h1>
            <p className="text-yellow-300">Node.js Addon in C++</p>
            <div className="mt-2 flex space-x-2">
              <button className="px-4 py-1 bg-yellow-500 text-black rounded">Follow</button>
              <button className="px-4 py-1 bg-yellow-600 text-black rounded">Subscribe</button>
            </div>
          </div>
          <div className="flex space-x-4 justify-end items-center">
            <Github className="w-6 h-6 hover:text-yellow-300 cursor-pointer" />
            <Twitter className="w-6 h-6 hover:text-yellow-300 cursor-pointer" />
            <Calendar className="w-6 h-6 hover:text-yellow-300 cursor-pointer" />
            <MessageCircle className="w-6 h-6 hover:text-yellow-300 cursor-pointer" />
            <Settings className="w-6 h-6 hover:text-yellow-300 cursor-pointer" />
          </div>
        </div>

        {/* Icon Grid */}
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="bg-yellow-950 rounded p-4 flex flex-col items-center">
            <img src="https://via.placeholder.com/80" alt="Discord" className="mb-2" />
            <span>Discord</span>
          </div>
          <div className="bg-yellow-950 rounded p-4 flex flex-col items-center">
            <img src="https://via.placeholder.com/80" alt="YouTube" className="mb-2" />
            <span>YouTube</span>
          </div>
        </div>
      </main>

      {/* Chat Panel */}
      <aside className="w-80 bg-yellow-950 flex flex-col">
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-sm"><span className="font-semibold">unknown0xe:</span> banger stream</div>
          <div className="text-sm"><span className="font-semibold">wicked_ev:</span> bye chat</div>
        </div>
        <div className="p-4 border-t border-yellow-800">
          <div className="bg-yellow-900 rounded p-2 text-xs">
            Animated Emotes can be disabled in Settings <button className="underline">Show me</button>
          </div>

          <div className="mt-2 flex overflow-hidden rounded bg-yellow-800">
            {/* <div className=""><span className="font-semibold">unknown0xe:</span> banger stream</div> */}
            <input
              type="text"
              placeholder="Send a message"
              className="w-0 flex-grow bg-yellow-800 px-3 py-1 text-sm placeholder-white focus:outline-none"
            />
            <button className="bg-yellow-400 px-3 flex items-center justify-center hover:bg-yellow-300">
              <Forward className="w-5 h-5 text-yellow-900" />
            </button>
          </div>

        </div>
      </aside>
    </div>
  );
};

export default Contact;
