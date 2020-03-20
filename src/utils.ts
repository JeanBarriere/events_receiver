export function getEnvOrError (envVar: string): string {
  if (envVar in process.env) {
    return process.env[envVar]!
  }
  throw new Error(`Environment variable '${envVar}' must be set.`)
}

export class IdentifierSet<T> extends Set<T> {
  private readonly _identifier: string

  constructor(identifier: string, iterable?: Iterable<T> | null) {
    super(iterable)
    this._identifier = identifier
  }

  public find (identifier: string): T | null {
    for (const item of this.values()) {
      if ((item as any)[this._identifier] === identifier) {
        return item
      }
    }
    return null
  }

  public findIndex (identifier: string): T | null {
    for (const item of this.values()) {
      if ((item as any)[this._identifier] === identifier) {
        return item
      }
    }
    return null
  }

  public has (item: T): boolean {
    return !!this.find((item as any)[this._identifier])
  }

  public get (identifier: string): T | null {
    return this.find(identifier)
  }
}
