import Header from './components/structure/Header';
import Body from './components/structure/Body';
import Footer from './components/structure/Footer';
import Menu from './components/structure/Menu';

function App() {
  return (
    <div className="bg-white flex flex-col justify-between min-h-screen text-sm sm:text-base">
      <div className="flex-grow flex flex-col">
        <Header />
        <div className="flex-grow flex">
          <div className="container flex">
            <Menu />
            <Body />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
