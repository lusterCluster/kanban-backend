import { RoleRepository } from "@repository/roleRepository";
import { RoleService } from "@service/roleService";
import { NextFunction, Request, Response } from "express";
const repository = new RoleRepository();
const service = new RoleService(repository);
export const checkRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const roles: string[] = req.body && req.body?.roles ? req.body?.roles : [];
  const role = Array.isArray(roles) && roles.length !== 0 ? roles : ["user"];
  try {
    const userRole = await service.findRoles({ name: { $in: role } });
    if (userRole.length === 0) {
      res.status(400).send({ message: "Role not found" });
      return;
    }
    req.body.roles = userRole.map((role) => role._id);
    next();
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: error });
  }
};
