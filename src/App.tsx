import './styles/App.css'
import Header from './components/layout/Header';
import Router from './routes/Router';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Router />
      {/* <Footer /> */}
    </div>
  )
}

export default App
