const express = require("express");

const database = require("../data/db");

// / const rouserter = express();

const router = express.Router()

router.use(express.json());

router.get("/", (_req, res) => {
    database
      .find()
      .then(posts => res.status(200).json(posts))
      .catch(() =>
        res
          .status(500)
          .json({ error: "The posts information could not be retrieved." })
      );
  });
  
  router.post("/", (req, res) => {
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
  
  router.post("/:postId/comments", (req, res) => {
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
  
  router.get("/:id", (req, res) => {
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
  
  router.delete("/:id", (req, res) => {
    const id = req.params.id;
    database.findById(id).then(post => {
      if (post.length) {
        database.remove(id).then(data => {
          console.log(data);
          if (data) {
            res.status(201).json({ message: "Deleted", data: post[0] });
          } else res.status(500).json({ error: "The post could not be removed" });
        });
      } else
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
    });
  });
  
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
  
    database.findById(id).then(post => {
      if (post.length) {
        if (title && contents) {
          database
            .update(id, { title, contents })
            .then(data => {
                if (data == '1') {
                  res
                  .status(201)
                  .json({ message: "updated", data: { id, title, contents } })
                }
  
                else res.status(403).json({message: 'Failed to update'})
            }  
            )
            .catch(() => {
              res
                .status(500)
                .json({ error: "The post information could not be modified." });
            });
        } else {
          res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
          });
        }
      } else
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
    });
  });
  
  module.exports = router;