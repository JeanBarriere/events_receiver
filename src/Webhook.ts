import { RequestHandler } from 'express'
import axios from 'axios'
import { getEnvOrError } from './utils'

export interface WebhookListener {
  subscriptionID: string
  service: string
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

  getListenersForEventType (_eventType: string): WebhookListener[] { return [] }

  public async process (...args: any[]): Promise<void> {
    const listeners = this.getListenersForEventType(await this.getEventTypeFromHook(...args))

    for (const listener of listeners) {
      const runtimeEvent = await this.getRuntimeEventFromHook(listener.subscriptionID, ...args)
      await axios.post(`${AWebhook.runtimeURL}/app/events`, runtimeEvent).then((res) => res.status === 200).catch(() => false)
    }
  }
}
