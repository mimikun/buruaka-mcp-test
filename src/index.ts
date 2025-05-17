import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = "https://api.ennead.cc/buruaka";

// Create server instance
const server = new McpServer({
  name: "buruaka",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Helper function for making API requests
async function makeAPIRequest<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making API request:", error);
    return null;
  }
}

// Created based on Blue Archive API response
// TODO: its
// character data response
interface CharacterResponse {
  id: number;
  isReleased: boolean;
  isPlayable: boolean;
  character: Character[];
  info: CharacterInfo[];
  image: CharacterImage[];
  stat: CharacterStat[];
  terrain: CharacterTerrain[];
  skill: CharacterSkill[];
}

interface Character {
  name: string;
  fullname: string;
  baseStar: number;
  rarity: string;
  armorType: string;
  bulletType: string;
  position: string;
  role: string;
  squadType: string;
  weaponType: string;
  profile: string;
}

interface CharacterInfo {
  age: number;
  birthDate: string;
  height: string;
  artist: string;
  club: string;
  school: string;
  schoolYear: string;
  voiceActor: string;
}

interface CharacterImage {
  icon: string;
  lobby: string;
  portrait: string;
}

interface CharacterStat {
  id: number;
  attackLevel1: number;
  attackLevel100: number;
  maxHPLevel1: number;
  maxHPLevel100: number;
  defenseLevel1: number;
  defenseLevel100: number;
  healPowerLevel1: number;
  healPowerLevel100: number;
  ammoCount: number;
  ammoCost: number;
  range: number;
  moveSpeed: number;
  streetMood: string;
  outdoorMood: string;
  indoorMood: string;
}

interface CharacterTerrain {
  urban: Terrain[];
  outdoor: Terrain[];
  indoor: Terrain[];
}

interface Terrain {
  DamageDealt: string;
  ShieldBlockRate: string;
}

interface CharacterSkill {
  ex: Skill[];
  normal: Skill[];
  passive: Skill[];
  sub: Skill[];
}

// かくの面倒だしそもそもスキル情報はいまは要らなかった
interface Skill {
  [];
}

// Register buruaka tools
server.tool(
  "get-name",
  "Get weather alerts for a state",
  {
    state: z.string().length(2).describe("Two-letter state code (e.g. CA, NY)"),
  },
  async ({ state }) => {
    const stateCode = state.toUpperCase();
    const alertsUrl = `${API_BASE}/alerts?area=${stateCode}`;
    const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

    if (!alertsData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve alerts data",
          },
        ],
      };
    }

    const features = alertsData.features || [];
    if (features.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No active alerts for ${stateCode}`,
          },
        ],
      };
    }

    const formattedAlerts = features.map(formatAlert);
    const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join("\n")}`;

    return {
      content: [
        {
          type: "text",
          text: alertsText,
        },
      ],
    };
  },
);

server.tool(
  "get-forecast",
  "Get weather forecast for a location",
  {
    latitude: z.number().min(-90).max(90).describe("Latitude of the location"),
    longitude: z
      .number()
      .min(-180)
      .max(180)
      .describe("Longitude of the location"),
  },
  async ({ latitude, longitude }) => {
    // Get grid point data
    const pointsUrl = `${API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

    if (!pointsData) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the Blue Archive API (only US locations are supported).`,
          },
        ],
      };
    }

    const forecastUrl = pointsData.properties?.forecast;
    if (!forecastUrl) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to get forecast URL from grid point data",
          },
        ],
      };
    }

    // Get forecast data
    const forecastData = await makeNWSRequest<ForecastResponse>(forecastUrl);
    if (!forecastData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve forecast data",
          },
        ],
      };
    }

    const periods = forecastData.properties?.periods || [];
    if (periods.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No forecast periods available",
          },
        ],
      };
    }

    // Format forecast periods
    const formattedForecast = periods.map((period: ForecastPeriod) =>
      [
        `${period.name || "Unknown"}:`,
        `Temperature: ${period.temperature || "Unknown"}°${period.temperatureUnit || "F"}`,
        `Wind: ${period.windSpeed || "Unknown"} ${period.windDirection || ""}`,
        `${period.shortForecast || "No forecast available"}`,
        "---",
      ].join("\n"),
    );

    const forecastText = `Forecast for ${latitude}, ${longitude}:\n\n${formattedForecast.join("\n")}`;

    return {
      content: [
        {
          type: "text",
          text: forecastText,
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Buruaka MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
