import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateWorkflow from './pages/CreateWorkflow';
import RunWorkflow from './pages/RunWorkflow';
import History from './pages/History';
import Status from './pages/Status';

function App() {
    return (
        <div className="app">
            <nav className="navbar">
                <div className="nav-brand">
                    <Link to="/">Workflow Builder Lite</Link>
                </div>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/create">Create Workflow</Link></li>
                    <li><Link to="/run">Run Workflow</Link></li>
                    <li><Link to="/history">History</Link></li>
                    <li><Link to="/status">Status</Link></li>
                </ul>
            </nav>

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<CreateWorkflow />} />
                    <Route path="/run" element={<RunWorkflow />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/status" element={<Status />} />
                </Routes>
            </main>

            <footer className="footer">
                <p>Workflow Builder Lite</p>
            </footer>
        </div>
    );
}

export default App;
