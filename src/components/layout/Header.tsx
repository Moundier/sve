import { NavLink } from 'react-router-dom';

const navBaseStyle = `px-4 block pt-3 pb-1 hover:bg-purple-600 text-bold`;
const isNavActive = (isActive: any) => `${navBaseStyle}` + (isActive ? ' bg-purple-600' : '');

const Header = () => {
  return (
    <header className="w-full h-[50px] bg-purple-800 flex justify-between items-end text-white px-4">
      <div className="flex items-center h-full text-2xl font-semibold">Brand</div>
      <nav className="flex justify-center gap-2 items-end">
        <NavLink className={({ isActive }) => isNavActive(isActive)} to="/" end>Video</NavLink>
        <NavLink className={({ isActive }) => isNavActive(isActive)} to="/about">Audio</NavLink>
        <NavLink className={({ isActive }) => isNavActive(isActive)} to="/contact">Control</NavLink>
      </nav>
    </header>
  );
};

export default Header;
