import { Clerk } from "@clerk/clerk-sdk-node";

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export const clerkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const claims = await clerk.verifyToken(token);

    req.auth = claims;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
