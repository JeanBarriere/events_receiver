import { RequestHandler } from 'express'
import axios from 'axios'
import { getEnvOrError } from './utils'

export interface WebhookListener {
  subscriptionID: string
  eventType: string
}

export type WebhookEvent = { [key: string]: string | number | boolean | undefined | WebhookEvent }

export interface RuntimeEvent {
  subscriptionID: string
  eventID: string
  eventPayload: any
}

export abstract class AWebhook {
  private static readonly runtimeURL = getEnvOrError('RUNTIME_URL')

  abstract get handler(): RequestHandler
  protected abstract getRuntimeEventFromHook(subscriptionID: string, ...args: any[]): Promise<RuntimeEvent>
  protected abstract getEventTypeFromHook(...args: any[]): Promise<string>

  getListenerForEventType (_eventType: string): WebhookListener | null { return null }

  public async process (...args: any[]): Promise<boolean> {
    const listener = this.getListenerForEventType(await this.getEventTypeFromHook(...args))
    if (listener) {
      const runtimeEvent = await this.getRuntimeEventFromHook(listener.subscriptionID, ...args)
      return await axios.post(`${AWebhook.runtimeURL}/app/events`, runtimeEvent).then((res) => res.status === 200).catch(() => false)
    }
    return false
  }
}
