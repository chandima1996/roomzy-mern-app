import { createClerkClient } from "@clerk/clerk-sdk-node";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.auth.userId; // This comes from our clerkAuth middleware
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const user = await clerkClient.users.getUser(userId);
    if (user.privateMetadata?.role === "admin") {
      next(); // User is an admin, proceed
    } else {
      res
        .status(403)
        .json({
          message: "Forbidden: Access is restricted to administrators.",
        });
    }
  } catch (error) {
    console.error("Admin check failed:", error);
    res.status(500).json({ message: "Error during admin verification." });
  }
};
