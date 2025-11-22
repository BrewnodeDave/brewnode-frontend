# Brewnode Frontend

A modern React-based web interface for controlling and monitoring the Brewnode brewery automation system.

## Features

### 🍺 Complete Brewery Control
- **Dashboard**: Real-time monitoring of all brewery systems
- **Brewfather Integration**: Full access to batches, recipes, and inventory
- **Process Control**: Automated mashing, boiling, fermentation, and transfers
- **Equipment Control**: Individual control of pumps, valves, heaters, and sensors
- **Simulator**: Hardware simulation for testing and development

### 🎯 Key Capabilities

#### Dashboard
- Real-time sensor monitoring (temperatures, equipment status)
- Current brew status and progress tracking
- Historical brew data with interactive charts
- System health and alert management
- Quick access to recent brews

#### Brewfather Integration
- Browse and search batches with status filtering
- View and edit batch details (gravity readings, status updates)
- Complete recipe library with detailed ingredient lists
- Full inventory management (fermentables, hops, yeasts, misc)
- Real-time inventory adjustments

#### Process Control
- **Mashing**: Multi-step temperature profiles with presets
- **Boiling**: Timed boil cycles with safety monitoring
- **Fermentation**: Multi-stage temperature control over days
- **Transfers**: Automated vessel-to-vessel transfers (K2M, M2K, K2F)
- **Temperature Control**: Precision heating and cooling

#### Equipment Control
- Individual pump control (kettle, mash, glycol)
- Valve management (kettle-in, mash-in, chiller valves)  
- Heater/chiller control (kettle, glycol heating/cooling)
- Fan control for extraction and cooling
- I2C pin control for custom hardware

#### Simulator
- Hardware simulation for development/testing
- Adjustable simulation speed (1x to 100x)
- Virtual kettle volume control
- Safety features for preventing empty vessel heating

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom brewery theme
- **State Management**: React Query for server state
- **Charts**: Recharts for temperature and process visualization
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form for complex brewing process forms
- **Routing**: React Router for SPA navigation
- **HTTP Client**: Axios with authentication and error handling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Running Brewnode server (backend API)

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

### Configuration

The frontend is configured to proxy API requests to the Brewnode server running on port 8080. If your server runs on a different port, update the `vite.config.js` proxy configuration.

## Usage

### Authentication

1. Start the application and navigate to the login page
2. Enter your Brewfather username and password
3. The system will authenticate and redirect to the dashboard

### Basic Workflow

1. **Monitor**: Use the dashboard to view real-time brewery status
2. **Plan**: Browse Brewfather recipes and manage inventory
3. **Brew**: Execute automated processes through Process Control
4. **Control**: Fine-tune individual equipment through Sensor Control
5. **Test**: Use Simulator for development and testing

### Advanced Features

#### Custom Mash Profiles
Create multi-step mash schedules:
- Protein rest (52°C, 15min)
- Beta amylase (63°C, 45min)  
- Alpha amylase (72°C, 30min)
- Mash out (78°C, 10min)

#### Fermentation Control
Set up complex fermentation schedules:
- Primary fermentation (18°C, 7 days)
- Diacetyl rest (20°C, 2 days)
- Cold crash (2°C, 2 days)

#### Inventory Management
- Track ingredient stock levels
- Adjust inventory with +/- controls
- Search and filter ingredients
- Update costs and suppliers

## API Integration

The frontend integrates with all Brewnode server endpoints:

### Brewnode Endpoints
- `/brewdata` - Historical brewing data
- `/brewing` - Current brew status
- `/sensorStatus` - Real-time sensor readings
- Process controls (`/mash`, `/boil`, `/ferment`, etc.)
- Equipment controls (`/pump/*`, `/valve/*`, `/heat`, etc.)
- Simulator controls (`/speedFactor`, `/kettleVolume`)

### Brewfather Endpoints  
- `/batches` - Batch management and readings
- `/batches/recipes` - Recipe library
- `/inventory/*` - Ingredient inventory management
- `/stream/*` - Custom device data streaming

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Route-level page components  
├── services/           # API client and service functions
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

### Key Components

- **Layout**: Main application layout with navigation
- **SensorStatusCard**: Reusable sensor display component
- **ProcessCard**: Interactive process control cards
- **EquipmentControl**: Individual equipment control interfaces
- **MashProfile/FermentationProfile**: Complex brewing process forms
- **BatchList/RecipeList**: Brewfather data management
- **InventoryManager**: Stock level management

### Styling

The application uses Tailwind CSS with a custom brewery color palette:
- Primary: Brewery orange (#f37b1f) 
- Variants: 50-900 color scale
- Semantic classes: `.btn`, `.card`, `.btn-primary`, etc.

### State Management

React Query manages all server state with:
- Automatic background refetching
- Optimistic updates for equipment controls
- Error handling and retry logic
- Cache invalidation on mutations

## Build and Deploy

### Development Build
```bash
npm run build
```

### Production Deployment
1. Build the application: `npm run build`
2. Serve the `dist` folder with any static file server
3. Ensure API proxy is configured for production

### Docker Deployment
The frontend can be containerized and deployed alongside the Brewnode server for a complete brewery automation solution.

## Browser Compatibility

- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

Modern JavaScript features (ES2020) are used throughout the application.

## Contributing

1. Follow the existing code style and patterns
2. Add new API endpoints to the appropriate service files
3. Create reusable components for common UI patterns
4. Test all equipment controls with the simulator
5. Ensure responsive design for tablet/mobile use

## Safety Considerations

⚠️ **Important**: This system controls real brewing equipment that involves:
- High temperatures (boiling water/wort)
- Pressurized systems
- Electrical equipment
- Chemical processes

Always:
- Test new features with the simulator first
- Verify equipment states before starting processes
- Monitor processes actively during operation
- Have manual overrides readily available
- Follow proper brewing safety protocols

## License

This project is part of the Brewnode brewery automation system.