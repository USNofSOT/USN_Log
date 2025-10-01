import { DiscordFormatStrategy, DiscordFormatData } from './DiscordFormatStrategy';

export class SaberDiscordFormat implements DiscordFormatStrategy {
  formatMessage(data: DiscordFormatData): string {
    if (data.mode === "patrol") {
      return this.formatPatrolMessage(data);
    } else {
      return this.formatSkirmishMessage(data);
    }
  }

  private formatPatrolMessage(data: DiscordFormatData): string {
    const sections = [];
    
    sections.push(`${data.title || "Patrol Log"}`);
    sections.push("");
    
    if (data.body) {
      sections.push(data.body);
      sections.push("");
    }
    
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
    
    if (data.signature) {
      sections.push("CO notes: " + data.signature);
    }
    
    return sections.join("\n");
  }

  private formatSkirmishMessage(data: DiscordFormatData): string {
    const sections = [];
    
    sections.push(`${data.title || "Skirmish Log"}`);
    sections.push("");
    
    if (data.body) {
      sections.push(data.body);
      sections.push("");
    }
    
    sections.push("Sunk/won");
    sections.push("❤️‍🩹 /❤️‍🔥");
    sections.push("");
    
    // Format dives
    if (data.dives.length === 0) {
      sections.push("No dives recorded");
    } else {
      data.dives.forEach(dive => {
        const ourEmoji = dive.ourTeam === "Athena" ? ":Athena:" : ":Reaper:";
        const enemyEmoji = dive.enemyTeam === "Athena" ? ":Athena:" : ":Reaper:";
        const outcomeEmoji = dive.outcome === "win" ? "❤️‍🔥" : "❤️‍🩹";
        
        let line = `USS Origin ${ourEmoji}  VS  ${enemyEmoji} / ${outcomeEmoji}`;
        if (dive.notes) {
          line += ` ( ${dive.notes} )`;
        }
        sections.push(line);
      });
    }

    if (data.dives.length > 0) {
      sections.push("");
      
      const wins = data.dives.filter(d => d.outcome === "win").length;
      const losses = data.dives.filter(d => d.outcome === "loss").length;
      
      // Calculate longest streak
      let longestStreak = 0;
      let currentStreak = 0;
      
      data.dives.forEach(dive => {
        if (dive.outcome === "win") {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });
      
      sections.push(`Won: ${wins}`);
      sections.push(`Sunk: ${losses}`);
      sections.push(`Longest streak: ${longestStreak}`);
    }
    
    if (data.signature) {
      sections.push("");
      sections.push(`CO notes: ${data.signature}`);
    }
    
    if (data.enableCrew && data.crew) {
      sections.push("");
      sections.push("__**Crew:**__");
      sections.push(data.crew);
    }
    
    return sections.join("\n");
  }
}
