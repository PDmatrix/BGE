export class StartGameCommand {
  constructor(
    public readonly userId: string,
    public readonly cols: number,
    public readonly rows: number,
  ) {}
}
