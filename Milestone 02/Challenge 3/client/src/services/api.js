const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const readResponse = async (response) => {
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
  return data;
};

export const fetchTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);
  return readResponse(response);
};

export const createTask = async (title, isImportant) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, isImportant })
  });
  return readResponse(response);
};

export const updateTaskStatus = async (id, completed) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  return readResponse(response);
};

export const updateTaskImportance = async (id, isImportant) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isImportant })
  });
  return readResponse(response);
};

export const deleteTaskFromApi = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE'
  });
  return readResponse(response);
};

export const fetchScore = async () => {
  const response = await fetch(`${API_URL}/score`);
  return readResponse(response);
};

export const generateTaskPlan = async (goal) => {
  const response = await fetch(`${API_URL}/ai/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal })
  });
  return readResponse(response);
};
