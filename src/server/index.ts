import * as express from "express";
import { resolve } from "path";
import * as bodyParser from "body-parser";
import { writeFileSync } from "fs";

const port = 1050;

const static_path = resolve(__dirname, "../../static");
const content_path = resolve(__dirname, "../../src/index.html");

const server = express();

server.use(bodyParser.json({ limit: "10mb" }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(static_path));

server.get("/backgroundColor", (_req, res) => res.send({ backgroundColor: "#F00" }));
server.get("/", (_req, res) => res.redirect("/logo"));
server.get("/logo", (_req, res) => res.sendFile(content_path));

server.post("/recordMostRecentClient", ({ body: { mostRecentClient } }, res) => {
    writeFileSync("./most_recent_client.txt", mostRecentClient);
    res.send();
});

server.listen(port, () => console.log(`Server listening on port ${port}...`));
