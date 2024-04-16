// Create Token and saving in cookie

export  const sendToken = (user, statusCode, res) => {
    const token = user.jwtGetToken();

    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000 // 5 days in milliseconds
        ),
        httpOnly: true,
    };


    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};

export default sendToken;

