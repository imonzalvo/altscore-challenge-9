import express from "express";
import phaseDiagramRouter from "./routes/phase-diagram.route";

const app = express();

app.use("/", phaseDiagramRouter);

export default app;
