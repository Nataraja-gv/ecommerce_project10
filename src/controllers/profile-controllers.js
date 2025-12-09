const userProfile = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(501).json({ message: "user not found" });
  }
  res
    .status(200)
    .json({ message: `${user?.user_name} profile details`, data: user });
};

module.exports = { userProfile };
