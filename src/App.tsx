import { Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import Hero from './page/Hero';
import FileContextProvider from './context/FileContext';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { AppLayout } from './components/app-layout';
import History from './page/History';

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
              <AppLayout>
                <FileContextProvider>
                  <Home />
                </FileContextProvider>
              </AppLayout>
            </SignedIn>
            <SignedOut>
              <SignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/history"
        element={
          <>
            <SignedIn>
              <AppLayout>
                <History />
              </AppLayout>
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
