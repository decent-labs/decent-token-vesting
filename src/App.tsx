import Header from './components/structure/Header';
import Body from './components/structure/Body';
import Footer from './components/structure/Footer';

function App() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="flex-grow flex flex-col">
        <Header />
        <Body />
      </div>
      <Footer />
    </div>
  );
}

export default App;
