import VideoLinux from "../components/common/Video";
import VideoTracker from "../components/common/VideoTracker";

const Home = () => (
  <main className={`flex-grow h-100 rounded-xl m-4 bg-pink-400 grid grid-cols-1 md:grid-cols-[250px_1fr] `}>
    <div className="bg-white  p-4">
      <h2 className="font-semibold text-6xl mb-4">Menu</h2>
      <ul>
        <li>
          <a href="#" className="bg-gray-300 p-3 mt-4 shadow rounded block">
            Videos
          </a>
        </li>
        <li>
          <a href="#" className="bg-gray-300 p-3 mt-4 shadow rounded block">
            Audios
          </a>
        </li>
        <li>
          <a href="#" className="bg-gray-300 p-3 mt-4 shadow rounded block">
            Collections
          </a>
        </li>
        <li>
          <a href="#" className="bg-gray-300 p-3 mt-4 shadow rounded block">
            Settings
          </a>
        </li>
      </ul>
    </div>

    <div className="bg-white p-3 shadow rounded-xl">  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-3 shadow rounded">Asset Pack 1</div>
        <div className="bg-white p-3 shadow rounded">Asset Pack 2</div>
        <div className="bg-white p-3 shadow rounded">Asset Pack 3</div>
      </div>

      <div className="mt-6">
        {/* Render Video Linux */}
        <VideoLinux />
        
        {/* Render Video Tracker */}
        <VideoTracker />
      </div>
    </div>
  </main>
);

export default Home;
