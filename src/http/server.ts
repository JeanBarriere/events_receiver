import { Server } from 'http'
import express, { Application, RequestHandler } from 'express'
import { json } from 'body-parser'
import { ServicesRegistry } from '../registry'
import { ListenerController } from './controllers/listener'

export class HTTPServer {
    private readonly app: Application

    constructor (servicesRegistry: ServicesRegistry, listenerController: ListenerController) {
        this.app = express()

        const bodyParser = json()

        this.app.post('/listen', bodyParser, listenerController.listen.bind(listenerController))
        this.app.post('/unlisten', bodyParser, listenerController.unlisten.bind(listenerController))    

        for (const [route, handler] of servicesRegistry.handlers) {
            this.app.use(route, handler)
        }
    }

    public install (route: string, handler: RequestHandler) {
        this.app.use(route, handler)
    }

    async start (port: string): Promise<Server> {
        return this.app.listen(port)
    }
}
