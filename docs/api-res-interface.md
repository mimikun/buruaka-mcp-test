APIのレスポンスをもとにインターフェイスを定義してください
幸い、ドキュメントが用意されています。

endpoint: https://api.ennead.cc/buruaka/banner
API document: https://github.com/torikushiii/BlueArchiveAPI/blob/main/docs/banner.md

レイド情報のドキュメントはこれです
endpoint: https://api.ennead.cc/buruaka/raid
API document: https://github.com/torikushiii/BlueArchiveAPI/blob/main/docs/raid.md

キャラクター情報
endpoint: https://api.ennead.cc/buruaka/character
API document: https://github.com/torikushiii/BlueArchiveAPI/blob/main/docs/character.md

できないことを無理矢理にお願いしたくないので、まずはできるかどうかおしえてください。


```ts
interface AlertFeature {
  properties: {
    event?: string;
    areaDesc?: string;
    severity?: string;
    status?: string;
    headline?: string;
  };
}

// Format alert data
function formatAlert(feature: AlertFeature): string {
  const props = feature.properties;
  return [
    `Event: ${props.event || "Unknown"}`,
    `Area: ${props.areaDesc || "Unknown"}`,
    `Severity: ${props.severity || "Unknown"}`,
    `Status: ${props.status || "Unknown"}`,
    `Headline: ${props.headline || "No headline"}`,
    "---",
  ].join("\n");
}

interface ForecastPeriod {
  name?: string;
  temperature?: number;
  temperatureUnit?: string;
  windSpeed?: string;
  windDirection?: string;
  shortForecast?: string;
}

interface AlertsResponse {
  features: AlertFeature[];
}

interface PointsResponse {
  properties: {
    forecast?: string;
  };
}

interface ForecastResponse {
  properties: {
    periods: ForecastPeriod[];
  };
}
```
