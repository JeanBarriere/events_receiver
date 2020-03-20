import { getEnvOrError } from './utils'
import { HTTPServer } from './http/server'
import { ServicesRegistry } from './registry'
import { ListenerController } from './http/controllers/listener'

async function main () {
    const signingKey = getEnvOrError('SLACK_BOT_SIGNING_KEY')

    const listenerController = new ListenerController()
    const servicesRegistry = new ServicesRegistry(new Map([['slack', [signingKey]]]))

    servicesRegistry.use(listenerController)

    const server = new HTTPServer(servicesRegistry, listenerController)

    await server.start('9005')
}

main().then(() => {
    console.log("🚀 Event Receiver running on :9005!")
}).catch(err => {
    console.error(err)
    process.exit(1)
})
