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

// Format character data
function formatCharacter(character: Character, info: CharacterInfo): string {
  return [
    `名前: ${character.fullname || character.name || "不明"}`,
    `プロフィール: ${character.profile || "情報なし"}`,
    `年齢: ${info.age || "不明"}`,
    `誕生日: ${info.birthDate || "不明"}`,
    `身長: ${info.height || "不明"}`,
    `絵師: ${info.artist || "不明"}`,
    `部活: ${info.club || "不明"}`,
    `学園: ${info.school || "不明"}${info.schoolYear ? ` ${info.schoolYear}年` : ""}`,
    `声: ${info.voiceActor || "不明"}`,
    `レアリティ: ${character.rarity || "不明"}`,
    `防具タイプ: ${character.armorType || "不明"}`,
    `弾薬タイプ: ${character.bulletType || "不明"}`,
    `ポジション: ${character.position || "不明"}`,
    `役割: ${character.role || "不明"}`,
  ].join("\n");
}

// Register buruaka tools
server.tool(
  "get-character",
  "Get character name",
  {
    name: z.string().describe("SHOULD input Japanese Kata-Kana"),
  },
  async ({ name }) => {
    const characterName = name;
    const characterUrl = `${API_BASE}/character/${characterName}?region=japan`;
    const characterData = await makeAPIRequest<CharacterResponse>(characterUrl);

    if (!characterData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve character data",
          },
        ],
      };
    }

    // 最初のキャラクター情報と追加情報を使用
    const character = characterData.character[0];
    const info = characterData.info[0];

    // フォーマット関数を使用してキャラクター情報を整形
    const characterText = formatCharacter(character, info);

    return {
      content: [
        {
          type: "text",
          text: characterText,
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
