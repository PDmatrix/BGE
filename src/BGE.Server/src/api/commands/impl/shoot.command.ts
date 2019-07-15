export class ShootCommand {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly userId: string,
    public readonly gameToken: string,
  ) {}
}
