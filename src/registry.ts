import { RequestHandler } from 'express'
import { Services } from './services'
import { AWebhook } from './Webhook'
import { ListenerController } from './http/controllers/listener'

export class ServicesRegistry {
  private _services: Map<string, AWebhook>

  constructor (services: Map<string, string[]>) {
    this._services = new Map<string, AWebhook>()

    for (const [serviceName, params] of services) {
      this._services.set(serviceName, new Services[serviceName](...params))
    }
  }
  public get (service: string): AWebhook | undefined {
    return this._services.get(service)
  }

  public get handlers (): Map<string, RequestHandler> {
    return new Map(Array.from(this._services, ([name, service]) => [`/service/${name}`, service.handler]))
  }

  public use (listenerController: ListenerController) {
    for (const [_name, service] of this._services) {
      service.getListenerForEventType = listenerController.hasListenerForEventType.bind(listenerController)
    }
  }
}
