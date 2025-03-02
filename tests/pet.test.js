const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const Pet = require("../models/petModel");

let mongoServer;

beforeAll(async () => {
  await mongoose.disconnect();

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Test 1: Create a new pet
describe("POST /api/pet", () => {
  it("should create a new pet", async () => {
    const petData = {
      name: "Buddy",
      age: "2",
      breed: "Golden Retriever",
      description: "A friendly pet",
      availability: true,
      charge_per_hour: "15",
    };

    const res = await request(app)
      .post("/api/pet")
      .send(petData)
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiIsImZ1bGxfbmFtZSI6IkFkbWluIiwiaWF0IjoxNzQwOTMyODM0LCJleHAiOjE3NDA5MzY0MzR9.fln9fEraJkwz-AW2chSvsswh03LX4khSLY6KwXEBoNg`
      );

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("name", "Buddy");
  });
});

// Test 2: Fetch all pets
describe("GET /api/pet", () => {
  it("should return an array of pets", async () => {
    const res = await request(app)
      .get("/api/pet")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlZXdhc0BnbWFpbC5jb20iLCJyb2xlIjoiY3VzdG9tZXIiLCJmdWxsX25hbWUiOiJEZWV3YXMgR2hpbWlyZSIsImlhdCI6MTc0MDkzMjY4OCwiZXhwIjoxNzQwOTM2Mjg4fQ.tu5GXwo01HefD5Ij5vzRmiS5EonTHhIcjZeITbdNlKE`
      );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// Test 3: Fetch a pet by ID
describe("GET /api/pet/:id", () => {
  it("should return a pet by ID", async () => {
    const pet = await Pet.create({
      name: "Rocky",
      age: "3",
      breed: "Bulldog",
      availability: true,
      charge_per_hour: "20",
    });

    const res = await request(app)
      .get(`/api/pet/${pet._id}`)
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlZXdhc0BnbWFpbC5jb20iLCJyb2xlIjoiY3VzdG9tZXIiLCJmdWxsX25hbWUiOiJEZWV3YXMgR2hpbWlyZSIsImlhdCI6MTc0MDkzMjY4OCwiZXhwIjoxNzQwOTM2Mjg4fQ.tu5GXwo01HefD5Ij5vzRmiS5EonTHhIcjZeITbdNlKE`
      );

    expect(res.statusCode).toBe(200);
    expect(res.body.pet.name).toBe("Rocky");
  });
});

// Test 4: Delete a pet
describe("DELETE /api/pet/:id", () => {
  it("should delete a pet", async () => {
    const pet = await Pet.create({
      name: "Bella",
      age: "1",
      breed: "Beagle",
      availability: true,
      charge_per_hour: "10",
    });

    const res = await request(app)
      .delete(`/api/pet/${pet._id}`)
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiIsImZ1bGxfbmFtZSI6IkFkbWluIiwiaWF0IjoxNzQwOTMyODM0LCJleHAiOjE3NDA5MzY0MzR9.fln9fEraJkwz-AW2chSvsswh03LX4khSLY6KwXEBoNg`
      );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Pet deleted successfully");
  });
});
