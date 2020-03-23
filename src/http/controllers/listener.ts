import { Request, Response } from 'express'
import { ListenersFactory } from 'src/listenersFactory'

export class ListenerController {
  private _factory: ListenersFactory

  constructor (listenersFactory: ListenersFactory) {
    this._factory = listenersFactory
  }

  public async listen (req: Request, res: Response): Promise<void> {
    const subscriptionID = req.body.subscriptionID as string
    const eventType = req.body.eventType as string
    const service = req.body.service as string

    this._factory.add({ subscriptionID, service, eventType })

    res.sendStatus(200)
  }

  public async unlisten (req: Request, res: Response): Promise<void> {
    const subscriptionID = req.body.subscriptionID as string

    this._factory.delete(subscriptionID)

    res.sendStatus(200)
  }
}
