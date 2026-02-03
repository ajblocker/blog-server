// blogService.js
// This module handles blog post CRUD operations

import { join } from "path";
import fs from "fs/promises";
import { format } from "date-fns";

// Filepath for posts.json. Use this for reading/writing posts.
const postsFile = join(process.cwd(), "posts.json");

/**
 * Reset posts.json: clear all posts and set nextId back to 1.
 */
export async function resetPosts() {
  //posts is empty
  const data = {
    nextId: 1,
    posts: [],
  };
  //brings in string from JSON file
  await fs.writeFile(postsFile, JSON.stringify(data));
  return `Post reset`;
}

/**
 * Add a new post with a unique ID and timestamp.
 * @param {string} title - Post title
 * @param {string} content - Post content
 * @returns {object} The newly created post object
 */
export async function createPost(title, content) {
  try {
    //read the file
    const read = await fs.readFile(postsFile, "utf8");
    //parse into an object
    const data = JSON.parse(read);
    //nextId in file = 1
    const currentNextId = data.nextId;
    //brings in empty array []
    let posts = data.posts;
    //creates a new post object
    const newPost = {
      id: currentNextId,
      title: title,
      content: content,
      createdAt: format(new Date(), "y-M-d h:m aaa"),
    };
    //add/push new content to post
    posts.push(newPost);
    //determine the nextId and increase by 1
    const nextId = currentNextId + 1;
    //build new file base with new post
    const newData = {
      nextId: nextId,
      posts: posts,
    };
    //write to file and bring in string from JSON
    await fs.writeFile(postsFile, JSON.stringify(newData));
    return newPost;
  } catch (error) {
    console.log(`An error occurred logging ${error}`);
  }
}

/**
 * Find and return a post by its ID.
 * @param {number} id - Post ID
 * @returns {object|undefined} The post if found, otherwise undefined
 */
export async function readPost(id) {
  try {
    //read the file
    const read = await fs.readFile(postsFile, "utf8");
    //parse and convert text into an object
    const data = JSON.parse(read);
    //find the post with matching id
    const findPost = data.posts.find(function (post) {
      //compare postId
      return post.id === id;
    });
    //if found true, send posts, if not send message back
    return findPost ? findPost : "Post not found";
  } catch (error) {
    console.log(`An error occurred logging ${error}`);
    return undefined;
  }
}

/**
 * Update a post's title and/or content.
 * @param {number} id - Post ID
 * @param {string} newTitle - New title (optional)
 * @param {string} newContent - New content (optional)
 * @returns {boolean} True if updated successfully, false if post not found
 */
export async function updatePost(id, newTitle, newContent) {
  try {
    //read the file
    const read = await fs.readFile(postsFile, "utf8");
    //parse and convert text into an object
    const data = JSON.parse(read);

    //find posts with matching id
    const post = data.posts.find(function (post) {
      return post.id === id;
    });
    //check if there is a post or not
    if (!post) {
      return false;
    }
    //update the title if present and not empty
    if (newTitle !== undefined && newTitle != "") {
      post.title = newTitle;
    }
    //update the content if not empty and present
    if (newContent !== undefined && newContent != "") {
      post.content = newContent;
    }
    //write to file and bring in string from JSON file
    await fs.writeFile(postsFile, JSON.stringify(data), "utf8");
    return true;
  } catch (error) {
    console.log(`An error occurred while logging ${error}`);
    return false;
  }
}

/**
 * Delete a post by its ID.
 * @param {number} id - Post ID
 * @returns {boolean} True if deleted successfully, false if post not found
 */
export async function deletePost(id) {
  try {
    //read the file
    const read = await fs.readFile(postsFile, "utf8");
    //parse and convert text into an object
    const data = JSON.parse(read);
    //check to see if id is valid
    const findI = data.posts.findIndex(function (post) {
      return post.id === id;
    });
    //checks if any posts not found
    if (findI === -1) {
      return false;
    }
    //makes a new array and filter through the post id
    const filteredPosts = data.posts.filter(function (post) {
      return post.id !== id;
    });

    //recreate the new updated data object
    //rewrites to the post
    const newData = {
      nextId: data.nextId,
      posts: filteredPosts,
    };

    //modifies the array and remove the post from the array
    data.posts.splice(findI, 1);
    //write to file and bring in string from JSON file
    await fs.writeFile(postsFile, JSON.stringify(newData), "utf8");
    return true;
  } catch (error) {
    console.log(`An error occurred logging ${error}`);
    return false;
  }
}

/**
 * Return all posts as an array of objects.
 * @returns {Array<object>} Array of all post objects
 */
export async function listPosts() {
  try {
    //read the file
    const read = await fs.readFile(postsFile, "utf8");
    //parse and convert text into an object
    const data = JSON.parse(read);
    //return the posts array
    return data.posts;
  } catch (error) {
    console.log(`An error occurred logging ${error}`);
  }
}
