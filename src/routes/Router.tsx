import { Routes, Route } from 'react-router-dom';

import BodyTransitionComponent from '../components/transitions/BodyAnimation';
import Home from '../views/Home';
import About from '../views/About';
import Contact from '../views/Contact';

const Router = () => {
  return (
    <Routes>
      <Route index element={
        <BodyTransitionComponent>
          <Home />
        </BodyTransitionComponent>
      }/>
      <Route path="/about" element={
        <BodyTransitionComponent>
          <About />
        </BodyTransitionComponent>
      }/>
      <Route path="/contact" element={
        <BodyTransitionComponent>
          <Contact />
        </BodyTransitionComponent>
      }/>
    </Routes>
  );
};

export default Router;
