import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">HotelHub</Link>
      </div>
      <nav className="flex items-center space-x-4">
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>
        <Link to="/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>

        {/* The SignedOut component renders its children only if the user is signed out. */}
        <SignedOut>
          <Link
            to="/sign-in"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign In
          </Link>
        </SignedOut>

        {/* The SignedIn component renders its children only if the user is signed in. */}
        <SignedIn>
          {/* UserButton is a pre-built component from Clerk that shows the user's avatar
              and provides options for profile management and sign-out. */}
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>
    </header>
  );
};

export default Header;
