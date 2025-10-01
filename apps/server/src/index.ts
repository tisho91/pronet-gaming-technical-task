import express from "express";
import path from "path";
import { User } from "@pronet/shared";

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "../../client/dist/client/browser")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/client/browser/index.html"));
});

app.listen(port, () => {
  const user: User = {
    email: "test",
    name: "s",
    id: 1,
    password: "123456",
  };
  console.log(`Example app listening on port ${port}`);
});
