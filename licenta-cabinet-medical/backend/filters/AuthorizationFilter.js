const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try{
      for (let i = 0; i < roles.length; i++) {
        if (req.user.userRole === roles[i]) {
          return next();
        }
      }
    } catch (error) {
      res.status(401).json({
        message: "You are not authorized"
      })
    }
  }
}
