const States = require('../model/states');
const statesJson = require('../model/statesData.json');

const getAllStateData = async (req, res) =>
{
  let contig = req.query?.contig;
  let statesList;

  let mongoStates = await States.find();

  if (contig === 'false'.toLowerCase())
  {
    statesList = statesJson.filter(st => st.code === 'AK' || st.code === 'HI')
  }
  else if (contig === 'true'.toLowerCase())
  {
    statesList = statesJson.filter(st => st.code !== 'AK' && st.code !== 'HI')
  }
  else
  {
    statesList = statesJson;
  }
  
  statesList.forEach(state => 
    {
    const stateExists = mongoStates.find(st => st.stateCode === state.code)

    if (stateExists)
    {
      state.funfacts = stateExists.funfacts;
    }
  });

  res.json(statesList);

}

const getState = async (req, res) => 
{
  let mongoStates = await States.find();

    if (!req?.params?.state) return res.status(400).json({ message: "State code is required."});
    
    const searchResult = statesJson.find((state) => state.code === req.params.state.toUpperCase());

    if (!searchResult) return res.status(400).json({message: "Invalid state abbreviation parameter"});

    const stateExists = mongoStates.find(st => st.stateCode === searchResult.code)

    if (stateExists)
    {
      searchResult.funfacts = stateExists.funfacts;
    }

    res.json(searchResult);
  };

const getRandomFunFact = async (req, res) =>
{
  const state = await States.findOne({ stateCode: req.params.state });
  const funFacts = state?.funfacts;

  // If no fun facts are found
  if (!funFacts) 
  {
    const stName = statesJson.find
    (
      (state) => state.code === req.params.state
    ).state;

  res.json({message: `No Fun Facts found for ${stName}`});
} 

  else 
  {
    const randomFunFact = funFacts[Math.floor(Math.random() * funFacts.length)];

    res.json
    ({
      funfact: randomFunFact,
    });
  }
};

const getCapital = (req, res) => 
{
    if (!req?.params?.state) return res.status(400).json({ message: "State code is required"});
  
    const state = statesJson.find((state) => state.code === req.params.state);

    if (!state) return res.status(400).json({message: "State does not exist."});
  
    res.json({
      state: state.state,
      capital: state.capital_city,
    });
  };

  const getNickname = (req, res) => 
  {
    if (!req?.params?.state) 
    {
        return res.status(400).json({ message: "State code is required"});
    }
  
    const state = statesJson.find((state) => state.code === req.params.state);
  
    res.json({
      state: state.state,
      nickname: state.nickname,
    });
  };

  const getPopulation = (req, res) => 
  {
    if (!req?.params?.state)  return res.status(400).json({message: "State code is required"});
  
    const state = statesJson.find((state) => state.code === req.params.state.toUpperCase());
  
    res.json({
      state: state.state,
      population: state.population.toLocaleString(),
    });
  };

  const getAdmission = (req, res) => 
  {
    if (!req?.params?.state) 
    {
        return res.status(400).json({message: "State code is required"});
    }
  
    const state = statesJson.find((state) => state.code === req.params.state);
  
    res.json({
      state: state.state,
      admitted: state.admission_date,
    });
  };

  const createNewFunFact = async (req, res) => 
{
    if (!req?.body?.funfacts) return res.status(400).json({message: "State fun facts value required"});

    if (!Array.isArray(req.body.funfacts)) 
    {
      return res.status(400).json({message: "State fun facts value must be an array"});
    }

    const state = await States.findOne({ stateCode: req.params.state }).exec();

    if (state) 
    {
      state.funfacts.push(...req.body.funfacts);
  
      const savedEntry = await state.save();
  
      res.json(savedEntry);
    } 

    else 
    {
      try 
      {
        const savedEntry = await States.create
        ({
          stateCode: req.params.state,
          funfacts: [...req.body.funfacts],
        });
  
        res.status(201).json(savedEntry);
      } 

      catch (error) 
      {
        console.log(error);
      }
    }
  };

  const replaceFunFact = async (req, res) =>
  {
    const index = req?.body?.index;
    const stCode = req?.params?.state;
    const funfact = req?.body?.funfact;
  
    if (!index) 
    {
      return res.status(400).json
      (
        {
          message: "State fun fact index value required",
        }
      );
    }
    if (!funfact) 
    {
      return res.status(400).json(
        {
          message: "State fun fact value required",
        }
      );
    }
  
    const state = await States.findOne({stateCode: stCode}).exec();
  
    if (!state)
    {
      const stateName = statesJson.find
      (
        (state) => state.code === stCode
      ).state;
  
      res.json({message: `No Fun Facts found for ${stateName}`});
    } 
    else if (!state.funfacts[index - 1]) 
    {
      const stateName = statesJson.find
      (
        (state) => state.code === stCode
      ).state;
  
      res.json({message: `No Fun Fact found at that index for ${stateName}`});
    } 
    else 
    {
      state.funfacts[index - 1] = funfact;
  
      const result = await state.save();
  
      res.json(result);
    }
  }

  const deleteFunFact = async (req, res) =>
{
  const index = req?.body?.index;
  const stCode = req?.params?.state;
  
  if (!index) 
  {
    return res.status(400).json
    (
      {
        message: "State fun fact index value required"
      }
    );
  }

  const state = await States.findOne({stateCode: stCode}).exec();

  if (!state) 
  {
    const stateName = statesJson.find
    (
      (state) => state.code === stCode
    ).state;

    res.json({message: `No Fun Facts found for ${stateName}`});
  } 
  else if (!state.funfacts[index - 1]) 
  {
    const stateName = statesJson.find
    (
      (state) => state.code === stCode
    ).state;

    res.json({message: `No Fun Fact found at that index for ${stateName}` });
  } 
  else 
  {
    state.funfacts.splice(index - 1, 1);

    const result = await state.save();

    res.json(result);
  }
}

module.exports = {

    getAllStateData,
    getRandomFunFact,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    createNewFunFact,
    replaceFunFact,
    deleteFunFact
}
