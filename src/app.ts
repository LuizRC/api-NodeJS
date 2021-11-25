import "reflect-metadata";
import express from 'express';
import createConnection  from "./database";
import { router } from "./routes";

createConnection();
const app = express();

//http://localhost:3333/users
//1 parametro => rota(recurso api)
// 2 parametro => request, response

app.use(express.json());
app.use(router);

export { app };