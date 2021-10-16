import Header from './components/structure/Header';
import Body from './components/structure/Body';
import Footer from './components/structure/Footer';
import Menu from './components/structure/Menu';

function App() {
  return (
    <div className="sandwich flex flex-col justify-between min-h-screen text-sm sm:text-base">
      <div className="flex-grow flex flex-col">
        <Header />
        <div className="flex flex-grow container">
          <div className="py-4 flex-none w-12 sm:w-40">
            <Menu />
          </div>
          <div className="border-r shadow" />
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
