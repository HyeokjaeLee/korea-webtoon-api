import express from "express";
import { naver_crawler } from "./components/naver-crawler";
const exp = express();
const port = 3000;
exp.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
exp.get("/", async (req, res) => {
  const naver = await naver_crawler();
  res.json(naver);
});
