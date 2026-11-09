import { createApp } from './app.js'
import { env } from './config/env.js'

const { httpServer } = await createApp()

httpServer.listen(env.PORT, () => {
  console.log(`🚀 Financy API ready at http://localhost:${env.PORT}/graphql`)
})
