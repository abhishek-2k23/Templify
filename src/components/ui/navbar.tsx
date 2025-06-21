import { FC } from "react"
import { Link } from "react-router-dom"
import { Button } from "./button"
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"

const Navbar: FC = () => {
  const navigate = useNavigate()
  return (
    <nav className="fixed top-0 w-full bg-gray-800/20 backdrop-blur-sm border-b border-gray-700/30 z-50">
      <div className="container flex h-14 items-center gap-10 justify-between py-4 px-6 md:py-8 md:px-10 lg:px-14">
        <div className="flex  items-center gap-2">
          <h1 className=" text-2xl md:text-3xl lg:text-4xl text-center  font-bold text-blue-500 tracking-wider">
            <Link to="/">Templify</Link>
          </h1>
        </div>

        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <div className="hidden md:block">
              <Button
                className="w-24 md:w-32 py-2 md:py-6"
                variant="default"
                onClick={() => navigate("/signup")}
              >
                <p className="text-sm md:text-lg py-1 md:py-4 tracking-wider">
                  Try Now
                </p>
              </Button>
            </div>
          </SignedOut>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
