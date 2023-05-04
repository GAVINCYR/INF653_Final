const statesJson = require('../model/statesData.json');

const verifyURL = (req, res, next) => {
  const stateCode = req?.params?.state?.toUpperCase();

  if (!stateCode) return res.status(400).json({message: "State code is required."});
  
  const validStateCodes = statesJson.map((state) => state.code);

  if (validStateCodes.indexOf(stateCode) !== -1) 
  {
    req.params.state = stateCode;

    next();
  } 
  else 
  {
    res.status(400).json({message: "Invalid state abbreviation parameter"});
  }
};

module.exports = verifyURL;