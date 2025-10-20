import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LiveChannels from './pages/LiveChannels';
import Search from './pages/Search';
import Categories from './pages/Categories';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<LiveChannels />} />
            <Route path="/search" element={<Search />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
