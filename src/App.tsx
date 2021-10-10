import Header from './components/structure/Header';
import Body from './components/structure/Body';
import Footer from './components/structure/Footer';
import Menu from './components/structure/Menu';

function App() {
  return (
    <div className="bg-white flex flex-col justify-between min-h-screen text-sm sm:text-base">
      <div className="flex-grow flex flex-col">
        <Header />
        <div className="sm:hidden">
          <div className="border-b">
            <div className="container">
              <Menu />
            </div>
          </div>
          <div className="container">
            <Body />
          </div>
        </div>
        <div className="hidden sm:flex flex-grow container">
          <div className="border-r pt-4 flex-none w-40">
            <Menu />
          </div>
          <div className="flex-grow pl-4">
            <Body />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
