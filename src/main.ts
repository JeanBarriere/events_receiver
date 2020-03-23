import { getEnvOrError } from './utils'
import { HTTPServer } from './http/server'
import { ServicesRegistry } from './registry'
import { ListenerController } from './http/controllers/listener'
import { ListenersFactory } from './listenersFactory'

async function main () {
    const signingKey = getEnvOrError('SLACK_BOT_SIGNING_KEY')

    const listenersFactory = new ListenersFactory()
    const listenerController = new ListenerController(listenersFactory)
    const servicesRegistry = new ServicesRegistry(new Map([['slack', [signingKey]]]), listenersFactory)

    const server = new HTTPServer(servicesRegistry, listenerController)

    await server.start('9005')
}

main().then(() => {
    console.log("🚀 Event Receiver running on :9005!")
}).catch(err => {
    console.error(err)
    process.exit(1)
})
