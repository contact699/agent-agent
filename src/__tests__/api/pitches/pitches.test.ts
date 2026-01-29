import { NextRequest } from "next/server";

// Mock next-auth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  authOptions: {},
}));

// Mock email
jest.mock("@/lib/email", () => ({
  sendPitchReceivedEmail: jest.fn().mockResolvedValue(undefined),
}));

// Mock prisma with inline jest.fn() calls
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    brokerage: {
      findUnique: jest.fn(),
    },
    agent: {
      findUnique: jest.fn(),
    },
    pitch: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

// Import after mocks are set up
import { GET, POST } from "@/app/api/pitches/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Get typed mock references
const mockGetServerSession = getServerSession as jest.Mock;
const mockBrokerageFindUnique = prisma.brokerage.findUnique as jest.Mock;
const mockAgentFindUnique = prisma.agent.findUnique as jest.Mock;
const mockPitchFindMany = prisma.pitch.findMany as jest.Mock;
const mockPitchFindUnique = prisma.pitch.findUnique as jest.Mock;
const mockPitchCreate = prisma.pitch.create as jest.Mock;
const mockUserFindUnique = prisma.user.findUnique as jest.Mock;

describe("GET /api/pitches", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return pitches for brokerage user", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "BROKERAGE" },
    });

    mockBrokerageFindUnique.mockResolvedValue({
      id: "brokerage-1",
      userId: "user-1",
    });

    mockPitchFindMany.mockResolvedValue([
      {
        id: "pitch-1",
        message: "Test pitch",
        paymentStatus: "PAID",
        agent: {
          id: "agent-1",
          anonymousId: "anon-1",
          yearsExperience: 5,
          salesVolume: 1000000,
          wishList: "Better split",
          name: "John Doe",
          licenseNumber: "12345",
        },
      },
      {
        id: "pitch-2",
        message: "Another pitch",
        paymentStatus: "PENDING",
        agent: {
          id: "agent-2",
          anonymousId: "anon-2",
          yearsExperience: 3,
          salesVolume: 500000,
          wishList: "Mentorship",
          name: "Jane Smith",
          licenseNumber: "67890",
        },
      },
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pitches).toHaveLength(2);
    // First pitch is PAID, should have name
    expect(data.pitches[0].agent.name).toBe("John Doe");
    // Second pitch is PENDING, should not have name
    expect(data.pitches[1].agent.name).toBeNull();
  });

  it("should return 404 if brokerage profile not found", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "BROKERAGE" },
    });

    mockBrokerageFindUnique.mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Brokerage profile not found");
  });

  it("should return pitches for agent user", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-2", role: "AGENT" },
    });

    mockAgentFindUnique.mockResolvedValue({
      id: "agent-1",
      userId: "user-2",
    });

    mockPitchFindMany.mockResolvedValue([
      {
        id: "pitch-1",
        message: "We want you!",
        brokerage: {
          id: "brokerage-1",
          companyName: "Best Brokerage",
        },
      },
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pitches).toHaveLength(1);
    expect(data.pitches[0].brokerage.companyName).toBe("Best Brokerage");
  });

  it("should return 404 if agent profile not found", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-2", role: "AGENT" },
    });

    mockAgentFindUnique.mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Agent profile not found");
  });
});

describe("POST /api/pitches", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (body: object): NextRequest => {
    return new NextRequest("http://localhost:3000/api/pitches", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  it("should return 401 if not authenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = createRequest({
      agentId: "agent-1",
      message: "Join us!",
      offerDetails: "90/10 split",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 403 if user is not a brokerage", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "AGENT" },
    });

    const request = createRequest({
      agentId: "agent-1",
      message: "Join us!",
      offerDetails: "90/10 split",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Only brokerages can send pitches");
  });

  it("should return 400 if required fields are missing", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "BROKERAGE" },
    });

    mockBrokerageFindUnique.mockResolvedValue({
      id: "brokerage-1",
      userId: "user-1",
    });

    const request = createRequest({
      agentId: "agent-1",
      message: "Join us!",
      // missing offerDetails
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Agent ID, message, and offer details are required");
  });

  it("should return 404 if agent not found", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "BROKERAGE" },
    });

    mockBrokerageFindUnique.mockResolvedValue({
      id: "brokerage-1",
      userId: "user-1",
    });

    mockAgentFindUnique.mockResolvedValue(null);

    const request = createRequest({
      agentId: "agent-1",
      message: "Join us!",
      offerDetails: "90/10 split",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Agent not found");
  });

  it("should return 409 if pitch already exists", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "BROKERAGE" },
    });

    mockBrokerageFindUnique.mockResolvedValue({
      id: "brokerage-1",
      userId: "user-1",
    });

    mockAgentFindUnique.mockResolvedValue({
      id: "agent-1",
      userId: "user-2",
    });

    mockPitchFindUnique.mockResolvedValue({
      id: "existing-pitch",
    });

    const request = createRequest({
      agentId: "agent-1",
      message: "Join us!",
      offerDetails: "90/10 split",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("You have already pitched this agent");
  });

  it("should create pitch successfully", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "BROKERAGE" },
    });

    mockBrokerageFindUnique.mockResolvedValue({
      id: "brokerage-1",
      userId: "user-1",
      companyName: "Best Brokerage",
    });

    mockAgentFindUnique.mockResolvedValue({
      id: "agent-1",
      userId: "user-2",
    });

    mockPitchFindUnique.mockResolvedValue(null);

    mockPitchCreate.mockResolvedValue({
      id: "new-pitch-id",
      agentId: "agent-1",
      brokerageId: "brokerage-1",
      message: "Join us!",
      offerDetails: "90/10 split",
      status: "PENDING",
      paymentStatus: "PENDING",
    });

    mockUserFindUnique.mockResolvedValue({
      email: "agent@test.com",
    });

    const request = createRequest({
      agentId: "agent-1",
      message: "Join us!",
      offerDetails: "90/10 split",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("Pitch sent successfully");
    expect(data.pitch.id).toBe("new-pitch-id");
    expect(mockPitchCreate).toHaveBeenCalledWith({
      data: {
        agentId: "agent-1",
        brokerageId: "brokerage-1",
        message: "Join us!",
        offerDetails: "90/10 split",
        status: "PENDING",
        paymentStatus: "PENDING",
      },
    });
  });
});
