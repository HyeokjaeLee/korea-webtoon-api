import express from "express";
const exp = express();
const port = 3000;
exp.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
exp.get("/", (req, res) => {
  const name = !req.query.name ? "World" : req.query.name;
  res.send(`Hello ${name}`);
});
