
// Import necessary modules and types
import { UserRepository } from "@repository/userRepository";
import { UserService } from "@service/userService";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { METHOTS, Permission, permissions } from "types/PermissionsTypes";
import { User } from "types/UsersTypes";

// Initialize repository and service instances
const repository = new UserRepository();
const service = new UserService(repository);

// Middleware to verify JWT token and authenticate user
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("req: ", req.headers); // Log request headers for debugging

  // Helper function to verify the JWT token and fetch the user
  const verifyUser = async () => {
    const jwtSecret = process.env.JWT_SECRET || ""; // Get JWT secret from environment variables
    const token = req.headers.authorization?.replace(
      /^Bearer\s+/,
      ""
    ) as string; // Extract token from Authorization header
    const verify = jwt.verify(token, jwtSecret) as User; // Verify the token and decode the user data
    const getUser = await service.findUsersById(verify.id); // Fetch user details from the database using the decoded user ID
    return getUser; // Return the fetched user
  };

  try {
    const user = await verifyUser(); // Verify the user and get user details
    if (!user) {
      res.status(404).json({ message: "user not found" }); // If user is not found, return 404 error
      return;
    }
    req.currentUser = user; // Attach the user object to the request for use in subsequent middleware
    next(); // Proceed to the next middleware
  } catch (error: any) {
    console.log("error: ", error); // Log any errors that occur during token verification
    res.status(401).send(error.message); // Return 401 Unauthorized if token verification fails
  }
};

// Curried function to get the required permission for the current request
const getRequiredPermission =
  (method: string) =>
  (path: string): string | null => {
    const currentModule = path.replace(/^\/([^\/]+).*/, "$1"); // Extract the module name from the path
    const currentMethodPermission = permissions.find(
      (permission) => permission.method === METHOTS[method as keyof typeof METHOTS]
    );

    if (!currentMethodPermission) {
      return null; // No permission found for the current method
    }

    return `${currentModule}_${currentMethodPermission.scope}`; // Construct the required permission
  };

// Curried function to get the user's permissions (direct or from roles)
const getUserPermissions =
  (currentUser: User) =>
  (): string[] => {
    if (currentUser.permissions?.length! > 0 && currentUser.permissions) {
      return currentUser.permissions; // Use direct permissions if available
    }

    // Fetch permissions from roles if no direct permissions are available
    return [
      ...new Set(currentUser.roles?.flatMap((role) => role.permissions)),
    ];
  };

// Curried function to check if the user has the required permission
const checkPermission =
  (userPermissions: string[]) =>
  (requiredPermission: string): boolean => {
    return userPermissions.includes(requiredPermission);
  };

// Middleware to check user permissions
export const getPermissions = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { currentUser, method, path } = req;

  // Step 1: Get the required permission for the current request
  const requiredPermission = getRequiredPermission(method)(path);
  if (!requiredPermission) {
    console.log("No permission found for method:", method);
     res.status(403).json({ message: "Unauthorized" });
     return
  }

  // Step 2: Get the user's permissions (direct or from roles)
  const userPermissions = getUserPermissions(currentUser)();

  // Step 3: Check if the user has the required permission
  const hasPermission = checkPermission(userPermissions)(requiredPermission);

  // Step 4: Deny access if the user does not have the required permission
  if (!hasPermission) {
     res.status(403).json({ message: "Unauthorized" });
     return
  }

  // Step 5: If the user has the required permission, proceed to the next middleware
  next();
};