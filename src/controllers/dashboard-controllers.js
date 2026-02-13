const dashboardControllers = async (req, res) => {
  try {
    const user = req.user;

    const userID = user._id;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = dashboardControllers;
