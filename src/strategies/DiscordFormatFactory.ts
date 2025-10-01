import { DiscordFormatStrategy } from './DiscordFormatStrategy';
import { StandardDiscordFormat } from './StandardDiscordFormat';
import { TrigsDiscordFormat } from './TrigsDiscordFormat';

export class DiscordFormatFactory {
  private static strategies: Map<string, DiscordFormatStrategy> = new Map([
    ['Standard', new StandardDiscordFormat()],
    ['Trigs', new TrigsDiscordFormat()],
  ]);

  public static getStrategy(format: string): DiscordFormatStrategy {
    const strategy = this.strategies.get(format);
    if (!strategy) {
      // Fallback to standard format if unknown format is requested
      return this.strategies.get('Standard')!;
    }
    return strategy;
  }

  public static getSupportedFormats(): string[] {
    return Array.from(this.strategies.keys());
  }

  public static registerStrategy(format: string, strategy: DiscordFormatStrategy): void {
    this.strategies.set(format, strategy);
  }
}
