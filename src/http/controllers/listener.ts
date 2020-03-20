import { Request, Response } from 'express'
import { IdentifierSet } from '../../utils'
import { WebhookListener } from '../../Webhook'

export class ListenerController {
  private _listeners: IdentifierSet<WebhookListener>

  constructor () {
    this._listeners = new IdentifierSet('subscriptionID')
  }

  public hasListenerForEventType (eventType: string): WebhookListener | null {
    for (const listener of this._listeners) {
      if (eventType === listener.eventType) {
        return listener
      }
    }
    return null
  }

  public async listen (req: Request, res: Response): Promise<void> {
    const subscriptionID = req.body.subscriptionID as string
    const eventType = req.body.eventType as string
    const listener: WebhookListener = { subscriptionID, eventType }

    this._listeners.add(listener)

    res.sendStatus(200)
  }

  public async unlisten (req: Request, res: Response): Promise<void> {
    const subscriptionID = req.body.subscriptionID as string

    const listener = this._listeners.find(subscriptionID)
    let deleted = false
    if (listener) {
      deleted = this._listeners.delete(listener)
    }

    res.sendStatus(deleted ? 200 : 404)
  }
}
