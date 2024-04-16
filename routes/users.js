import express, { response } from "express";
import { deleteUser, forgotPassword, getUser, getUsers, resetPassword, updatePassword, updateUser } from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";



const router = express.Router();

// CHECK AUTHENTICATION
// router.get("/checkauthentication", verifyToken, (req,res,next)=>{
//   res.send("hello user, you are logged in")
// })

// router.get("/checkuser/:id", verifyUser, (req,res,next)=>{
//   res.send("hello user, you are logged in and you can delete your account")
// })

// router.get("/checkadmin/:id", verifyAdmin, (req,res,next)=>{
//     res.send("hello admin, you are logged in and you can delete all account")
//   })




router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.post("/password/update", verifyUser,updatePassword);

//UPDATE
// router.put("/:id",verifyUser, updateUser)
router.put('/:id/update', updateUser);


//DELETE
router.delete("/:id", deleteUser)

//GET
router.get("/:id",verifyUser, getUser)

//GET ALl
router.get("/", getUsers)


export default router