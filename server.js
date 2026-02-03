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
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    const response = await createPost(title, content);
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
    const response = await readPost(id);
    res.status(200).json({ message: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// PUT /posts/:id     → Update a post by ID
app.put("/posts/:id", async (req, res) => {
  try {
    const modifiedId = parseInt(req.params.id);
    const { title, content } = req.body;

    if (!title && !content) {
      return res
        .status(400)
        .json({ error: "Either title or content must be provided" });
    }

    const response = await updatePost(modifiedId, title, content);
    if (!response) {
      return res.status(404).json({ error: `Post ${modifiedId} not found` });
    }

    const updated = await readPost(modifiedId);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// DELETE /posts/:id  → Delete a post by ID
app.delete("/posts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const response = await deletePost(id);

    if (!response) {
      res.status(404).json({ error: `Post ${id} not found` });
    }
    res.status(200).json({ message: `Post ${id} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET /posts         → List all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await listPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (process.argv[1] === __filename) {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

export default app;
