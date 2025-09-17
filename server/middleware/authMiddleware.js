import { createClerkClient } from "@clerk/clerk-sdk-node";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  jwtKey: process.env.CLERK_JWT_KEY, // Add this line
});

export const clerkAuth = async (req, res, next) => {
  console.log("this is clerk auth function");
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Use the clerkClient to verify the session token.
    // This method is specifically designed for this purpose and is more robust.
    const claims = await clerkClient.verifyToken(token);

    // Attach the verified claims to the request object for use in controllers.
    // 'sub' is the standard JWT claim for the user ID.
    req.auth = { userId: claims.sub };

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    // Log the detailed error from Clerk for better debugging on the server side.
    console.error("Clerk token verification failed:", error);
    // Send a clear error message to the client.
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
