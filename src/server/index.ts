import * as express from "express";
import { join } from "path";

const port = 1050;
const content_path = "../../build/index.html";
const server = express();

server.use(express.static(__dirname + "/public"));

console.log(`Server listening on port ${port}...`);

server.get("/", (_req, res) => res.redirect("/logo"));
server.get("/logo", (_req, res) => {
    res.sendFile(join(__dirname, content_path));
});

server.listen(port);
