import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../envs.js"

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (!token) {
    res.status(401).send("No token provided.")
    return
  }

  try {
    jwt.verify(token, JWT_SECRET)
    next()
  } catch (err) {
    res.status(403).send("Invalid token.")
    return
  }
}
