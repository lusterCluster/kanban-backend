import { UserRepository } from "@repository/userRepository";
import { UserService } from "@service/userService";
import { Request, Response } from "express";
import { User } from "types/UsersTypes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email }: User = req.body;
    const userExists = await userService.findUserByEmail(email);
    if (userExists) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json(error);
  }
};
export const loginUser = async (req: Request, res: Response) => {
  const jwtSecret = process.env.JWT_SECRET || "";
  try {
    const { email, password }: User = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: "invalid user or password" });
      return;
    }
    const comparePassword = await user.comparePassword(password);
    if (!comparePassword) {
      res.status(400).json({ message: "INVALID USER OR PASSWORD" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      jwtSecret,
      { expiresIn: "1h" }
    );
    res.json(token);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json(error);
  }
};
