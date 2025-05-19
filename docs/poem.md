# poem

現在のLLMは推論ベースなので知識をそのまま蓄えているわけではない
モデルによってどこまでのデータで訓練しているか違う(詳しくは下の方で)
なので別途、外からデータを与えてやらないと変な結果しか得られない

であればそのデータを与えてやれば動くということなので、与えてやる。
色々テクノロジーがある。

- Function Calling(OpenAI)
- Tool(Anthropic)
- MCP(Anthropic)
- LangChain(LangChain)
- Agent to Agent(Google)

Agent to Agentはエージェント同士つなぐだけなので、外部知識取り込みという目的にはあっていないように見える。
となるとFunction CallingかToolかMCPか、となる

---

## どこまでのデータで訓練しているか

### OpenAI

https://platform.openai.com/docs/models/gpt-4.1 の Jun 01, 2024 knowledge cutoff
`knowledge cutoff` に着目。一覧で載っているページはなかった。

- GPT-4.1: 2024/6
- GPT-4o: 2023/10
- ChatGPT-4o: 2023/10

(OpenAIは後ろに書いてある英数字と新しさが関係しないのでわかりにくい)

### Anthropic

https://support.anthropic.com/ja/articles/8114494-%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%89%E3%81%AE%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%B0%E3%83%87%E3%83%BC%E3%82%BF%E3%81%AF%E3%81%A9%E3%81%AE%E7%A8%8B%E5%BA%A6%E6%9C%80%E6%96%B0%E3%81%AE%E3%82%82%E3%81%AE%E3%81%A7%E3%81%99%E3%81%8B

- Claude 3 Opus: 2023/8
- Claude 3 Haiku: 2023/8
- Claude 3.5 Sonnet: 2024/4
- Claude 3.5 Haiku: 2024/7
- Claude 3.7 Sonnet: 2024/11
