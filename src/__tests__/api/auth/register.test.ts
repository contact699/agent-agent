import { NextRequest } from "next/server";

// Mock bcryptjs
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

// Mock prisma with inline jest.fn() calls
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Import after mocks are set up
import { POST } from "@/app/api/auth/register/route";
import prisma from "@/lib/prisma";

// Get typed mock references
const mockFindUnique = prisma.user.findUnique as jest.Mock;
const mockCreate = prisma.user.create as jest.Mock;

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (body: object): NextRequest => {
    return new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  it("should return 400 if email is missing", async () => {
    const request = createRequest({ password: "password123", role: "AGENT" });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email, password, and role are required");
  });

  it("should return 400 if password is missing", async () => {
    const request = createRequest({ email: "test@test.com", role: "AGENT" });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email, password, and role are required");
  });

  it("should return 400 if role is missing", async () => {
    const request = createRequest({
      email: "test@test.com",
      password: "password123",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email, password, and role are required");
  });

  it("should return 400 if role is invalid", async () => {
    const request = createRequest({
      email: "test@test.com",
      password: "password123",
      role: "INVALID",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Role must be AGENT or BROKERAGE");
  });

  it("should return 400 if password is too short", async () => {
    const request = createRequest({
      email: "test@test.com",
      password: "short",
      role: "AGENT",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Password must be at least 8 characters");
  });

  it("should return 409 if user already exists", async () => {
    mockFindUnique.mockResolvedValue({
      id: "existing-user-id",
      email: "test@test.com",
    });

    const request = createRequest({
      email: "test@test.com",
      password: "password123",
      role: "AGENT",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("User with this email already exists");
  });

  it("should create user successfully with AGENT role", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: "new-user-id",
      email: "test@test.com",
      role: "AGENT",
    });

    const request = createRequest({
      email: "test@test.com",
      password: "password123",
      role: "AGENT",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("User created successfully");
    expect(data.user).toEqual({
      id: "new-user-id",
      email: "test@test.com",
      role: "AGENT",
    });
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        email: "test@test.com",
        passwordHash: "hashed_password",
        role: "AGENT",
      },
    });
  });

  it("should create user successfully with BROKERAGE role", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: "new-brokerage-id",
      email: "brokerage@test.com",
      role: "BROKERAGE",
    });

    const request = createRequest({
      email: "brokerage@test.com",
      password: "password123",
      role: "BROKERAGE",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("User created successfully");
    expect(data.user.role).toBe("BROKERAGE");
  });

  it("should return 500 on database error", async () => {
    mockFindUnique.mockRejectedValue(new Error("Database error"));

    const request = createRequest({
      email: "test@test.com",
      password: "password123",
      role: "AGENT",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });
});
