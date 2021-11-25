import  request  from "supertest";
import { app } from "../app";

import createConnection from '../database';

describe("Surveys", () => {
    beforeAll( async () => {
        const Connection = await createConnection();
        await Connection.runMigrations();
    });

    it("Should be able to create a new survey", async () => {
        const response = await request(app).post("/surveys").send({
            title: "NodeJS API",
            description: "First Api and NodeJs",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("Should be able to get all surveys", async () => {
        await request(app).post("/surveys").send({
            title: "React Native",
            description: "Dev FullStack",
        });

        const response = await request(app).get("/surveys");

        expect(response.body.length).toBe(2);

    });

});