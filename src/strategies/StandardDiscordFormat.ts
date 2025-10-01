import { DiscordFormatStrategy, DiscordFormatData } from './DiscordFormatStrategy';

export class StandardDiscordFormat implements DiscordFormatStrategy {
  formatMessage(data: DiscordFormatData): string {
    const formatCommonSections = () => {
      const sections = [
        data.title || "Title here",
        "",
        data.body || (data.mode === "patrol" ? "Patrol details here" : "Skirmish details here"),
        "",
      ];
      return sections.join("\n");
    };

    const formatSignature = () => {
      const sections = [
        "",
        "Signed:",
        data.signature || "Your Signature",
      ].filter(Boolean);
      return sections.join("\n");
    };

    const formatPatrolContent = () => {
      const sections = [
      ];

      if (data.enableEvents && data.events) {
        sections.push("Events:");
        sections.push(data.events);
        sections.push("");
      }

      sections.push(`Gold: ${data.gold || "0"}`);
      sections.push(`Doubloons: ${data.doubloons || "0"}`);
      sections.push("");
      
      if (data.enableCrew && data.crew) {
        sections.push("Crew:");
        sections.push(data.crew);
        sections.push("");
      }
      
      return sections.join("\n");
    };

    const formatSkirmishContent = () => {
      const formatTeamEmoji = (team: "Athena" | "Reaper") =>
        `${team} ${team === "Athena" ? ":Athena:" : ":Reaper:"}`;

      const formatDive = (dive: any, index: number) => {
        const vs = `${formatTeamEmoji(dive.ourTeam)} vs. ${formatTeamEmoji(dive.enemyTeam)}`;
        const notes = dive.notes ? ` - ${dive.notes}` : "";
        return `${index + 1}. ${vs} [${dive.outcome}]${notes}`;
      };

      const sections = [
        "",
        `Team: ${data.ourTeam || "Athena"}`,
        "",
        "Dives:",
        data.dives.length
          ? data.dives.map((d, i) => formatDive(d, i)).join("\n")
          : "No dives yet",
        ""
      ];

      if (data.enableCrew && data.crew) {
        sections.push("Crew:");
        sections.push(data.crew);
        sections.push("");
      }
      return sections.join("\n");
    };

    const content = [
      formatCommonSections(),
      data.mode === "patrol" ? formatPatrolContent() : formatSkirmishContent(),
      formatSignature(),
    ].join("\n");

    return content.trim();
  }
}
