const confessionService = require('../services/confessionService');

const createConfession = (req, res) => {
  const requestBody = req.body;
  
  // Early returns prevent deep nesting and improve readability
  if (!requestBody) return res.status(400).json({ msg: 'bad' });
  if (!requestBody.text) return res.status(400).json({ msg: 'need text' });
  if (requestBody.text.length === 0) return res.status(400).send("too short");
  if (requestBody.text.length >= 500) return res.status(400).json({ error: "text too big, must be less than 500 characters long buddy" });

  const result = confessionService.addConfession(requestBody.text, requestBody.category);
  
  if (result.error) {
    return res.status(result.status).send(result.error);
  }
  
  res.status(result.status).json(result.data);
};

const getAllConfessions = (req, res) => {
  console.log("fetching all data result");
  res.json(confessionService.getAll());
};

const getConfessionById = (req, res) => {
  const info = confessionService.getById(req.params.id);
  
  if (!info) return res.status(404).json({ msg: 'not found' });
  if (!info.text) return res.status(500).send("broken");
  
  console.log("found info with " + info.text.length + " chars");
  res.json(info);
};

const getConfessionsByCategory = (req, res) => {
  const filteredConfessions = confessionService.getByCategory(req.params.cat);
  
  if (!filteredConfessions) {
    return res.status(400).json({ msg: 'invalid category' });
  }
  
  res.json(filteredConfessions);
};

const deleteConfession = (req, res) => {
  // Use environment variable for authorization token
  if (req.headers['x-delete-token'] !== process.env.DELETE_TOKEN) {
    return res.status(403).json({ msg: 'no permission' });
  }
  
  if (!req.params.id) return res.status(400).send("no id");

  const deletedItem = confessionService.removeById(req.params.id);
  
  if (!deletedItem) {
    return res.status(404).json({ msg: "not found buddy" });
  }
  
  res.json({ msg: "ok", item: deletedItem });
};

module.exports = {
  createConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfession
};