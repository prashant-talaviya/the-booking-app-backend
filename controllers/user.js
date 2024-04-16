import User from "../models/User.js"
import sendEmail from "../utils/sendEmail.js";
// import crypto from "crypto";
import bcrypt from "bcryptjs"



// export const updateUser = async(req,res,next)=>{
//     try {
//         const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
//         res.status(200).json(updatedUser)
//     } catch (err) {
//         next(err)
//     }
// }




export const updateUser = async (req, res, next) => {
    const { email, phone, password } = req.body;

    // Optional: Add validation for the inputs here
    // ...

    const updatedData = {};
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;

    try {
        // If password is provided, hash it before saving
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(password, salt);
        }

        // Update the user in the database
        const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        // If user is not found, return an error
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Do not send back the password, even if it's hashed
        const userResponse = { ...user._doc };
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (err) {
        next(err);
    }
};


export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted.")
    } catch (err) {
        next(err)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        next(err)
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate a temporary password
        const tempPassword = Array(12).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;':,.<>/?~").map(x => x[Math.floor(Math.random() * x.length)]).join('');

        // Hash the temporary password
        const hashedTempPassword = await bcrypt.hash(tempPassword, 12);

        // Update the user's password with the new hash
        user.password = hashedTempPassword;
        await user.save();

        // Email the temporary password to the user
        const message = `Hello ${user.username},\n\nYourpassword is: ${tempPassword}\n\nPlease keep this information secure. Click the link to log in: http://localhost:3000/login`;

        await sendEmail({
            email: user.email,
            subject: `Your temporary password`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `password sent to ${user.email} successfully.,`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Failed to send temporary password email"
        });
    }
};




//reset  password

export const resetPassword = async (req, res) => {

    //creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    console.log("Reset Password Token:", resetPasswordToken); // Add logging

    const user = await User.findOne({
        resetPasswordToken,
    });

    console.log("User found:", user); // Add logging

    if (!user) {
        console.log("No user found with token:", resetPasswordToken); // Add logging
        return res.status(404).json({
            success: false,
            message: "Reset Password Token is invalid or has been expired"
        });
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password not Match"
        });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        message: "password reset successfully"
    })
};




export const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select("+password")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "New passwords do not match"
            });
        }

        // Hash the new password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};