const { body, validationResult } = require("express-validator");

const validateTherapySession = () => {
  return [
    body("date").isISO8601().withMessage("Invalid date format"),
    body("start_time")
      .isInt({ min: 0, max: 23 })
      .withMessage("Start time must be an hour (0-23)"),
    body("end_time")
      .isInt({ min: 1, max: 23 })
      .withMessage("End time must be an hour (1-23)"),
    body("end_time").custom((value, { req }) => {
      if (value <= req.body.start_time) {
        throw new Error("End time must be greater than start time");
      }
      return true;
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

module.exports = { validateTherapySession };
