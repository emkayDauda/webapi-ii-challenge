const express = require("express");

const database = require("./data/db");

const server = express();

server.use(express.json());

server.get("/", (_req, res) => {
  res.send("Homepage of local API");
});

server.get("/api/posts", (_req, res) => {
  database
    .find()
    .then(posts => res.status(200).json(posts))
    .catch(() =>
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." })
    );
});

server.post("/api/posts", (req, res) => {
  const { title, contents } = req.body;
  if (title && contents) {
    database
      .insert(req.body)
      .then(() => {
        database
          .find()
          .then(posts => res.status(201).json(posts))
          .catch(() =>
            res.status(201).json({ message: "Data posted successully" })
          );
      })
      .catch(() =>
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        })
      );
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

server.post("/api/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (text && postId) {
    const newBody = { text, post_id: postId };
    database
      .findById(postId)
      .then(post => {
        if (post.length) {
          console.log(post.length);
          database
            .insertComment(newBody)
            .then(() => res.status(200).json(newBody))
            .catch(() => {
              res.status(500).json({
                error: "There was an error saving to the database"
              });
            });
        } else res.status(404).json({ message: "Post with that id not found" });
      })
      .catch(() => {
        res.status(500).json({
          error: "There was an error while saving the comment to the database"
        });
      });
  }
});

server.get("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  database
    .findById(id)
    .then(post => {
      if (post.length) {
        console.log(post.length);
        res.status(201).json(post);
      } else
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

server.listen(4001, () => {
  console.log("\n*** Server Running on http://localhost:4001 ***\n");
});
