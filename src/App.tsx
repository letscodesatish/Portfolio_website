import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const Landing = lazy(() => import("./components/Auth/Landing"));
const AdminLogin = lazy(() => import("./components/Auth/AdminLogin"));
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <BrowserRouter>
      <LoadingProvider>
         <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <MainContainer>
                  <Suspense>
                    <CharacterModel />
                  </Suspense>
                </MainContainer>
              }
            />
            <Route path="/login" element={<Landing />} />
            <Route path="/signup" element={<Landing />} />
            <Route path="/admin" element={<AdminLogin />} />
          </Routes>
        </Suspense>
      </LoadingProvider>
    </BrowserRouter>
  );
};

export default App;
