# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server that provides Blue Archive game information to LLMs. It interfaces with the unofficial Blue Archive API at `https://api.ennead.cc/buruaka`.

## Development Commands

```bash
# Build the project
npm run build      # Linux/Mac (includes chmod)
npm run build:win  # Windows

# Install dependencies
npm install
```

## Architecture

- **MCP Server**: Uses `@modelcontextprotocol/sdk` to expose tools to LLMs
- **API Integration**: Helper function `makeApiRequest` handles HTTP requests to external API
- **TypeScript**: Strict mode, ES2022 target, Node16 module resolution
- **Current Tools**: 
  - `get-character`: Retrieves character information by Japanese katakana name

## API Endpoints

The Blue Archive API provides three main endpoints:

- `/api/character?name={name}` - Character information
- `/api/raid/current` - Current raid information  
- `/api/banner/current` - Current banner information

## Key Implementation Notes

- Character names must be provided in Japanese katakana (e.g., "ユウカ" for Yuuka)
- The actual API response contains more fields than currently defined in interfaces (see `docs/character-res.json` for full structure)
- Output is formatted in Japanese for character information
- The project is designed to provide external game data to LLMs that may have outdated information
