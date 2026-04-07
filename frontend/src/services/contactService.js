import api from "./api";

// retrieving all the contact messages from the DB...
export const getAllContactMessages = () => api.get("/api/contact");

// retrieving a single contact message by id...
export const getContactMessageById = (id) => api.get(`/api/contact/${id}`);

// creating a new contact message...
export const createContactMessage = (contactData) =>
  api.post("/api/contact", contactData);