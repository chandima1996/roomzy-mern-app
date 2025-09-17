import { useUser } from "@clerk/clerk-react";

export const useAdmin = () => {
  const { user } = useUser();

  // Clerk stores private metadata in a special object called 'unsafeMetadata'.
  // It's called "unsafe" to remind you not to render it directly on the screen,
  // but it's perfectly safe for authorization checks like this.
  const isAdmin = user?.privateMetadata?.role === "admin";

  return { isAdmin };
};
