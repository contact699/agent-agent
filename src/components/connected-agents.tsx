"use client";

interface ConnectedAgent {
  id: string;
  name: string;
  licenseNumber: string;
  yearsExperience: number;
  salesVolume: number;
  connectedAt: string;
}

interface Props {
  agents: ConnectedAgent[];
}

export default function ConnectedAgents({ agents }: Props) {
  if (agents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Connected Agents</h2>
        <p className="text-gray-500 text-center py-8">
          No connected agents yet. When an agent accepts your pitch and you complete payment, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Connected Agents ({agents.length})
      </h2>
      <div className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="border rounded-lg p-4 hover:border-blue-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{agent.name}</h3>
                <p className="text-sm text-gray-600">
                  License: {agent.licenseNumber}
                </p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Connected
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Experience:</span>{" "}
                <span className="font-medium">{agent.yearsExperience} years</span>
              </div>
              <div>
                <span className="text-gray-500">Sales Volume:</span>{" "}
                <span className="font-medium">
                  ${agent.salesVolume.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Connected on {new Date(agent.connectedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
