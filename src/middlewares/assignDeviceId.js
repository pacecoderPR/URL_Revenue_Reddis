const { v4: uuidv4 } = require('uuid');
exports.assignDeviceId = (req, res, next) => {
    const { deviceId } = req.cookies;
    if (!deviceId) {
      const newDeviceId = uuidv4();
      res.cookie('deviceId', newDeviceId, { httpOnly: true, secure: false }); // Set cookie
      req.deviceId = newDeviceId; // Attach to request
      
    } else {
      req.deviceId = deviceId; // Attach existing deviceId
    }
    next();
  };
  