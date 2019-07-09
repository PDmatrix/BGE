export class AcceptGameCommand {
  constructor(
    public readonly userId: string,
    public readonly gameToken: string,
  ) {}
}
