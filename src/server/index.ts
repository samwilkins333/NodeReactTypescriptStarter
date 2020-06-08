import * as express from "express";
import { resolve } from "path";
import * as bodyParser from "body-parser";
import { Database } from "./database";
import { AppliedSessionAgent, Monitor, ServerWorker } from "resilient-server-session";
import { v4 } from "uuid";
import { config } from "dotenv";
import { ensureConnection } from "../../ngrok";

config();
const port = 3000;

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
    
    server.post("/recordMostRecentClient", async ({ body }, res) => {
        await Database.deleteMany("clientLog", {});
        await Database.insert("clientLog", body);
        res.send();
    });
    
    server.listen(port, async () => {
        console.log(`Server listening on port ${port}...`);
        const success = await ensureConnection((url: string) => console.log(`Ngrok listening at ${url}`));
        if (!success) {
            console.log("Unable to start ngrok.");
        }
    });
}

class ProjectSessionAgent extends AppliedSessionAgent {
    
    protected initializeMonitor(monitor: Monitor) {
        monitor.addReplCommand("hello", [], () => console.log("world!"));
        return v4();
    }
    
    protected initializeServerWorker() {
        return ServerWorker.Create(initialize);
    }

}

if (process.env.MONITORED === "true") {
    new ProjectSessionAgent().launch();
} else {
    initialize();
}
