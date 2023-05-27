import router from "../routes";
const request = require("supertest");
const express = require("express");

let app = express();

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use(router);
});

describe("Test student routes", () => {
  it("creates a new student", async () => {
    const studentData = {
      first_name: "John",
      last_name: "Doe",
      dob: "2002-05-13T13:31:13.332Z",
      classId: 5,
      gender: "MALE",
      // ... other required fields here
    };
    const res = await request(app).post("/students/post").send(studentData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("name", "John Doe");
    // ... other assertions here
  });

  it("gets all students with pagination", async () => {
    const res = await request(app).get("/students?page=1&limit=10");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("currentPage", 1);
    expect(res.body).toHaveProperty("totalItems");
    expect(res.body).toHaveProperty("items");
  });

  it("gets all students", async () => {
    const res = await request(app).get("/students/all");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("gets a single student", async () => {
    // Replace '1' with a valid student ID in your test DB
    const res = await request(app).get("/student/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", 1);
  });

  it("updates a student", async () => {
    const updateData = {
      first_name: "Ebbe",
      last_name: "Blind",
      dob: "2010-05-13T13:31:13.332Z",
      classId: 4,
      gender: "MALE",
    };
    // Replace '1' with a valid student ID in your test DB
    const res = await request(app).patch("/student/1").send(updateData);
    expect(res.statusCode).toEqual(202);
    expect(res.body).toHaveProperty("name", "Updated Name");
  });

  it("deletes a student", async () => {
    // Replace '1' with a valid student ID in your test DB
    const res = await request(app).delete("/student/1");
    expect(res.statusCode).toEqual(204);
  });
});
