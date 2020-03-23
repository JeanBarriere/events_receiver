import { IdentifierSet } from "./utils"
import { WebhookListener } from "./Webhook"

export class ListenersFactory {
  private _listeners: IdentifierSet<WebhookListener>

  constructor () {
    this._listeners = new IdentifierSet('subscriptionID')
  }

  public get (service: string): WebhookListener[] {
    return Array.from(this._listeners).filter(l => l.service === service)
  }

  public has (subscriptionID: string): boolean {
    return !!this._listeners.find(subscriptionID)
  }

  public add (listener: WebhookListener): void {
    this._listeners.add(listener)
  }

  public delete (subscriptionID: string): boolean {
    const subscription = this._listeners.find(subscriptionID)

    if (subscription) {
      return this._listeners.delete(subscription)
    }

    return false
  }
}
