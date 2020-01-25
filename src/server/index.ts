import * as express from "express";
import { resolve } from "path";
import * as bodyParser from "body-parser";
import { Database } from "./database";

const port = 1050;

const static_path = resolve(__dirname, "../../static");
const content_path = resolve(__dirname, "../../src/index.html");


async function initialize() {
    
    await Database.connect("NodeReactTypescriptStarter");
    await Database.clearCollections("store", "clientLog");
    await Database.insert("store", {
        hello: "world",
        one_fish: "two_fish",
        red_fish: "blue_fish",
        json: true,
    });

    const server = express();
    
    server.use(bodyParser.json({ limit: "10mb" }));
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(express.static(static_path));
    
    server.get("/backgroundColor", (_req, res) => res.send({ backgroundColor: "#F00" }));
    server.get("/", (_req, res) => res.redirect("/logo"));
    server.get("/logo", (_req, res) => res.sendFile(content_path));
    
    server.post("/recordMostRecentClient", ({ body }, res) => {
        Database.insert("clientLog", body);
        res.send();
    });
    
    server.listen(port, () => console.log(`Server listening on port ${port}...`));
}

initialize();