import { RequestHandler } from 'express'
import { Services } from './services'
import { AWebhook, WebhookListener } from './Webhook'
import { ListenersFactory } from './listenersFactory'

export class ServicesRegistry {
  private _services: Map<string, AWebhook>
  private readonly _factory: ListenersFactory

  constructor (services: Map<string, string[]>, listenersFactory: ListenersFactory) {
    this._services = new Map<string, AWebhook>()
    this._factory = listenersFactory

    for (const [serviceName, params] of services) {
      this._services.set(serviceName, new Services[serviceName](...params))
      this._services.get(serviceName)!.getListenersForEventType = this.getListeners(serviceName).bind(this)
    }
  }

  public get (service: string): AWebhook | undefined {
    return this._services.get(service)
  }

  public get handlers (): Map<string, RequestHandler> {
    return new Map(Array.from(this._services, ([name, service]) => [`/service/${name}`, service.handler]))
  }

  private getListeners (service: string): (eventType: string) => WebhookListener[] {
    return (eventType: string): WebhookListener[] => {
      return this._factory.get(service).filter(l => l.eventType === eventType)
    }
  }
}
