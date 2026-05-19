import { Route, Routes } from 'react-router-dom';
import { ThemePage } from './pages/ThemePage';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<ThemePage />} />
            </Routes>
        </>
    );
}

export default App;
