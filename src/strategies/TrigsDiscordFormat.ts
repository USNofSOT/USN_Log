import { DiscordFormatStrategy, DiscordFormatData } from './DiscordFormatStrategy';

export class TrigsDiscordFormat implements DiscordFormatStrategy {
  formatMessage(data: DiscordFormatData): string {
    if (data.mode === "patrol") {
      return this.formatPatrolMessage(data);
    } else {
      return this.formatSkirmishMessage(data);
    }
  }

  private formatPatrolMessage(data: DiscordFormatData): string {
    const sections = [];
    
    // Trig's format uses a more structured approach with markdown
    sections.push(`${data.title || "Official Patrol Report"}`);
    sections.push("");
    
    if (data.body) {
      sections.push(data.body);
      sections.push("");
    }
    
    // Format events with bullet points
    if (data.enableEvents && data.events) {
      sections.push("**Events:**");
      const eventList = data.events.split("\n").filter(e => e.trim());
      eventList.forEach(event => {
        sections.push(`${event}`);
      });
      sections.push("");
    }
    
    sections.push("**Loot Confiscated:**");;
    const formatNumber = (num: number) => num.toLocaleString();
    sections.push(`:Gold: Gold: ${formatNumber(Number(data.gold) || 0)}`);
    sections.push(`:Doubloons: Doubloons: ${formatNumber(Number(data.doubloons) || 0)}`);
    sections.push("");
    
    // Crew roster with bullet points
    if (data.enableCrew && data.crew) {
      sections.push("**Crew:**");
      const crewList = data.crew.split("\n").filter(c => c.trim());
      crewList.forEach(member => {
        sections.push(`${member}`);
      });
      sections.push("");
    }
    
    if (data.signature) {
      sections.push("**CO Notes:**");
      sections.push(data.signature);
    }
    
    return sections.join("\n");
  }

  private formatSkirmishMessage(data: DiscordFormatData): string {
    const sections = [];
    
    sections.push(`${data.title || "Official Skirmish Log"}`);
    sections.push("");
    
    if (data.body) {
      sections.push(data.body);
      sections.push("");
    }
    
    sections.push("**Dives:**");
    if (data.dives.length === 0) {
      sections.push("No dives recorded");
    } else {
      data.dives.forEach((dive, index) => {
        const ourEmoji = dive.ourTeam === "Athena" ? ":Athena:" : ":Reaper:";
        const enemyEmoji = dive.enemyTeam === "Athena" ? ":Athena:" : ":Reaper:";
        const resultEmoji = dive.outcome === "win" ? "❤️‍🔥 (win)" : "❤️‍🩹 (loss)";
        
        sections.push(`${index + 1}. ${ourEmoji} vs ${enemyEmoji} ${resultEmoji}`);
        if (dive.notes) {
          sections.push(`> ${dive.notes}`);
        }
      });
    }

    if (data.dives.length > 0) {
      sections.push("");
      sections.push("**Events:**");
      const wins = data.dives.filter(d => d.outcome === "win").length;
      const losses = data.dives.filter(d => d.outcome === "loss").length;
      const winRate = ((wins / (wins + losses)) * 100).toFixed(1);
      const streaks = data.dives.reduce((acc, dive) => {
        if (dive.outcome === "win") {
          acc.currentStreak++;
          acc.highestStreak = Math.max(acc.highestStreak, acc.currentStreak);
        } else {
          acc.currentStreak = 0;
        }
        return acc;
      }, { currentStreak: 0, highestStreak: 0 });

      sections.push(`🏆 Win/Loss: ${wins}/${losses} (${winRate}%)`);
      sections.push(`🔥 Highest Streak: ${streaks.highestStreak}`);
    }
    
    if (data.signature) {
      sections.push("");
      sections.push(`**CO Notes:**`);
      sections.push(data.signature);
    }
    
    return sections.join("\n");
  }
}
