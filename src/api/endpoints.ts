import API from "./axios.js"


// Fetch all posts
export const getAllPosts = async () => {
  const { data } = await API.get("blogpost?page=1&limit=20");
  return data;
};

// Fetch single post
export const getPostById = async (id: any) => {
  const { data } = await API.get(`/blogpost/${id}`);
  return data;
};
export type ReactionType = "like" | "love" | "clap";

export const reactToPost = async (id: any, type: ReactionType) => {
  const { data } = await API.post(`/blogpost/${id}/react`, { type });
  return data;
};  
export type NewComment = { displayName: string; message: string };
export const commentOnPost = async (id: any, comment: NewComment) => {
  const { data } = await API.post(`/blogpost/${id}/comments`, comment);
  return data;
};

