import API from "./axios.js"


// Fetch all posts
export const getAllPosts = async () => {
  const { data } = await API.get("blogpost?page=1&limit=20");
  return data;
};

// Fetch single post
export const getPostById = async (id: any) => {
  const { data } = await API.get(`/posts/${id}`);
  return data;
};

