import { SlackService } from './slack'
import { AWebhook } from '../Webhook'

interface IServices {
  [key: string]: any & AWebhook
}

export const Services: IServices = { slack: SlackService }
