// In-memory database
let confessions = [];
let nextId = 0;

const VALID_CATEGORIES = ["bug", "deadline", "imposter", "vibe-code"];

const addConfession = (text, category) => {
  if (!VALID_CATEGORIES.includes(category)) {
    return { error: "category not in stuff", status: 400 };
  }

  // Construct the new confession object
  const newConfession = {
    id: ++nextId,
    text: text,
    category: category,
    created_at: new Date()
  };
  
  confessions.push(newConfession);
  console.log("added one info " + newConfession.id);
  return { data: newConfession, status: 201 };
};

const getAll = () => {
  // Sort descending by creation time
  const sortedConfessions = [...confessions].sort((a, b) => b.created_at - a.created_at);
  return {
    data: sortedConfessions,
    count: sortedConfessions.length
  };
};

const getById = (id) => {
  const confessionId = parseInt(id);
  const info = confessions.find(fn => fn.id === confessionId);
  return info || null;
};

const getByCategory = (category) => {
  if (!VALID_CATEGORIES.includes(category)) return null;
  
  // Filter and reverse to match original logic
  return confessions.filter(x => x.category === category).reverse();
};

const removeById = (id) => {
  const confessionId = parseInt(id);
  const confessionIndex = confessions.findIndex(item => item.id === confessionId);
  
  if (confessionIndex === -1) return null;
  
  // Splice removes the item and returns an array of deleted items
  const deletedItems = confessions.splice(confessionIndex, 1);
  console.log("deleted something");
  return deletedItems[0];
};

module.exports = {
  addConfession,
  getAll,
  getById,
  getByCategory,
  removeById
};