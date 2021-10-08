import Header from './components/structure/Header';
import Body from './components/structure/Body';
import Footer from './components/structure/Footer';
import LeftMenu from './components/structure/LeftMenu';

function App() {
  return (
    <div className="bg-white flex flex-col justify-between min-h-screen">
      <div className="flex-grow flex flex-col">
        <Header />
        <div className="flex-grow flex">
          <div className="container flex">
            <LeftMenu />
            <Body />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
