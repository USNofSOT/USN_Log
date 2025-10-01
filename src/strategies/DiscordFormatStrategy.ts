export interface DiscordFormatStrategy {
  formatMessage(data: DiscordFormatData): string;
}

export interface DiscordFormatData {
  mode: "patrol" | "skirmish";
  title: string;
  body: string;
  signature: string;
  events: string;
  crew: string;
  gold: string;
  doubloons: string;
  ourTeam: "Athena" | "Reaper";
  dives: Array<{
    ourTeam: "Athena" | "Reaper";
    enemyTeam: "Athena" | "Reaper";
    outcome: "win" | "loss";
    notes: string;
  }>;
  enableEvents: boolean;
  enableCrew: boolean;
}
