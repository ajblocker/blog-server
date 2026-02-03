import express from "express";
import { fileURLToPath } from "url";
import {
  createPost,
  deletePost,
  listPosts,
  readPost,
  resetPosts,
  updatePost,
} from "./blogService.js";

const __filename = fileURLToPath(import.meta.url);

const app = express();
const PORT = 3000;

app.use(express.json());

// ------------------- Routes -------------------

// Reset all posts (example route)
app.post("/reset", async (req, res) => {
  await resetPosts();
  res.json({ message: "Posts have been reset" });
});

// TODO: Implement the following routes:
// POST /posts        → Create a new post
app.post("/posts", async (req, res) => {
  try {
    //grabbing title and content from the body of JSON
    const { title, content } = req.body;
    //checking for the title and content if available
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    //create the post from createPost function
    const response = await createPost(title, content);
    //displays message from createPost function
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET /posts/:id     → Read a post by ID
//get will never have a body
app.get("/posts/:id", async (req, res) => {
  //create a try catch block
  try {
    //do i need something from the body or params?
    //grab id
    const id = parseInt(req.params.id);
    //what to do with params?
    //check if there is an id
    if (!id) {
      return res.status(404).json({ error: `Post ${id} not found` });
    }
    //read the post from readPost function
    const response = await readPost(id);
    //displays message from readPost function
    res.status(200).json({ message: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// PUT /posts/:id     → Update a post by ID
app.put("/posts/:id", async (req, res) => {
  try {
    //grab id
    const modifiedId = parseInt(req.params.id);
    //grab title and content from JSON
    const { title, content } = req.body;
    //check if title and content are present
    if (!title && !content) {
      return res
        .status(400)
        .json({ error: "Either title or content must be provided" });
    }

    //update the post from updatePost function
    const response = await updatePost(modifiedId, title, content);
    if (!response) {
      return res.status(404).json({ error: `Post ${modifiedId} not found` });
    }
    //read the post and grab the id
    const updated = await readPost(modifiedId);
    //display message from readPost function
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// DELETE /posts/:id  → Delete a post by ID
app.delete("/posts/:id", async (req, res) => {
  try {
    //grab the id
    const id = parseInt(req.params.id);
    //delete post by id from deletePost function
    const response = await deletePost(id);

    //check if there is a post
    if (!response) {
      res.status(404).json({ error: `Post ${id} not found` });
    }
    //post deleted successfully
    res.status(200).json({ message: `Post ${id} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET /posts         → List all posts
app.get("/posts", async (req, res) => {
  try {
    //grab all posts from listPosts function
    const posts = await listPosts();
    //display message from listPosts
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (process.argv[1] === __filename) {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

export default app;
