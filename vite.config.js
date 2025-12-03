import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      // Proxy all API routes to the backend server
      '^/(sensorStatus|brewdata|brewing|brewname|logs|mysql|restart|streamLog|batches|inventory|recipes|stream|fan|i2c|pumps|valve|valves|boil|chill|ferment|fill|k2f|k2m|m2k|mash|kettleTemp|heat|pump|glycol|kettleVolume|speedFactor|systemStatus)': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})