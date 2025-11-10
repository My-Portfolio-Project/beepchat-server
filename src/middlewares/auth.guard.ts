 import { Request,Response, NextFunction } from "express"
 const jwt = require('jsonwebtoken')
 const { prisma } = require('../../config/db')
 




interface JwtPayload {
  id: string;
}

async function protectRoute(req: Request, res: Response, next: NextFunction) {
  try {
 
    // const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return res.status(401).json({
    //     message: "No token provided or invalid authorization header",
    //   });
    // }
  
    // const token = authHeader.split(" ")[1];
    const token = req.cookies.token
    // console.log("Protected Token:", token);

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SEC as string) as JwtPayload;
    // console.log("decoded:", decoded)

    
const user = await prisma.user.findUnique({
  where: { id: decoded.id },
  select: {
    id: true,
    fullName: true,
    email: true,
  },
});


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    (req as any).user = user;

    next();
    
  } catch (error: any) {
    console.error("Auth Error:", error);
    return res.status(500).json({
      message: error?.message || "Internal server error",
    });
  }
}

module.exports = protectRoute;
