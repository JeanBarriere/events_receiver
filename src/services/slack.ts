import { createEventAdapter } from '@slack/events-api'
import SlackEventAdapter from '@slack/events-api/dist/adapter'
import { RequestHandler } from 'express'
import { AWebhook, RuntimeEvent, WebhookEvent } from '../Webhook'

interface SlackMessageEvent extends WebhookEvent {
  type: string
  subtype?: string
  channel: string
  user: string
  text: string
  ts: string
  edited?: { user: string, ts: string }
}

export class SlackService extends AWebhook {
  private readonly _eventsAdapter: SlackEventAdapter

  constructor(signingKey: string) {
    super()
    this._eventsAdapter = createEventAdapter(signingKey, { includeBody: true })
    this._eventsAdapter.on('message', this.process.bind(this))
    this._eventsAdapter.on('app_mention', this.process.bind(this))
  }

  public get handler(): RequestHandler {
    return this._eventsAdapter.expressMiddleware()
  }

  protected async getEventTypeFromHook (event: SlackMessageEvent): Promise<string> {
    return event.type
  }

  protected async getRuntimeEventFromHook (subscriptionID: string, event: SlackMessageEvent, body: any): Promise<RuntimeEvent> {
    return {
      subscriptionID,
      eventID: body.event_id,
      eventPayload: {
        teamID: body.team_id,
        ...event
      }
    }
  }
}

export default SlackService
