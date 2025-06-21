import { Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import Hero from './page/Hero';
import FileContextProvider from './context/FileContext';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/home"
        element={
          <>
            <SignedIn>
              <FileContextProvider>
                <Home />
              </FileContextProvider>
            </SignedIn>
            <SignedOut>
              <SignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

export default App;
