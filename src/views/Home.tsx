import { useState } from 'react';
import ReactSlider from '../components/common/Slider/Slider';

const MIN = 0;
const MAX = 2000;

const Home = () => {

  const [values, setValues] = useState([MIN, MAX]);

  return (
    <main className="bg-blue-100 m-4 rounded-xl p-6 overflow-y-auto flex-1">
      <div style={{ width: '200px' }}>
        <ReactSlider
          min={0}
          max={100}
          orientation='horizontal' // vertical is not working
          value={values}
          onChange={(newValue) => setValues(newValue as number[])}
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          defaultValue={[0, 100]}
          ariaLabel={['Lower thumb', 'Upper thumb']}
          ariaValueText={state => `Thumb value ${state.valueNow}`}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
          pearling
          minDistance={20}
        />
      </div>
    </main>
  );
};

export default Home;
