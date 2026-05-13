import { Route, Routes } from "react-router-dom";
import { GlobalLoadingIndicator } from "./components/globalLoadingIndicator";

function App() {


  return (
    <>
      <GlobalLoadingIndicator />
      <Routes>
        
        <Route
          path="/"
          element={
            <div>Demo</div>
          }
        />
        
      </Routes>
    </>
  );
}

export default App;
