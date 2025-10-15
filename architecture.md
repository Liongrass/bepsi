# 21UP Bitcoin Vending Machine Architecture

## Overview

The 21UP is a Bitcoin-only vending machine that accepts Lightning Network payments and dispenses physical cans. The system runs on a Raspberry Pi or similar Linux device and integrates with LNbits for Lightning payment processing.

## System Architecture

### Core Components

1. **Main Application** (`index.js`)
   - Entry point of the application
   - Initializes the Lightning listener
   - Handles graceful shutdown

2. **Lightning Payment Listener** (`src/listeners/lightningL.js`)
   - WebSocket connection to LNbits server
   - Receives payment notifications
   - Triggers dispensing process

3. **Vending Machine Controller** (`src/machine.js`)
   - GPIO pin management for hardware control
   - Button press detection
   - Relay control for dispensing

4. **Utilities** (`src/common.js`, `src/env.js`)
   - Helper functions and configuration
   - Environment variable validation
   - System utilities

### Hardware Components

- **Raspberry Pi** - Main computing unit
- **GPIO Pins** - For button input detection
- **Relays** - For activating dispensing mechanisms
- **Physical Buttons** - Customer interaction points
- **Vending Trays** - Physical storage for cans

## System Flow

### Payment to Dispense Process

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Customer      │    │   Lightning     │    │   21UP Machine  │
│   (Mobile App)  │    │   Network       │    │   (Raspberry Pi)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Scan QR Code       │                       │
         ├──────────────────────▶│                       │
         │                       │                       │
         │ 2. Send Lightning     │                       │
         │    Payment (sats)     │                       │
         ├──────────────────────▶│                       │
         │                       │                       │
         │                       │ 3. Payment            │
         │                       │    Notification       │
         │                       ├──────────────────────▶│
         │                       │                       │
         │                       │                       │ 4. Activate
         │                       │                       │    Relay
         │                       │                       │
         │ 5. Press Button       │                       │
         ├──────────────────────▶│                       │
         │                       │                       │
         │                       │                       │ 6. Dispense
         │                       │                       │    Can
         │ 7. Receive Can        │                       │
         │◀──────────────────────┤                       │
```

### Detailed Step-by-Step Process

#### Step 1: Customer Initiates Payment

- Customer scans QR code displayed on machine
- QR code contains Lightning invoice information
- Customer's Lightning wallet (e.g., Phoenix, Breez) processes payment

#### Step 2: Lightning Payment Processing

- Payment flows through Lightning Network
- LNbits server receives payment confirmation
- Payment amount and metadata are processed

#### Step 3: Payment Notification

- LNbits sends WebSocket message to 21UP machine
- Message format: `"pin-duration"` (e.g., `"21-1000"`)
- `pin`: GPIO pin number for the selected tray
- `duration`: Duration in milliseconds for relay activation

#### Step 4: Machine Activation

- 21UP receives WebSocket message
- Parses pin number and duration
- Calls `dispenseFromPayments(pinOut, duration)`
- Activates relay on specified GPIO pin

#### Step 5: Customer Interaction

- Relay activation makes the selected tray "hot"
- Customer presses physical button on the tray
- Button press detected via GPIO input pin

#### Step 6: Can Dispensing

- Button press triggers `stoprelay()` function
- Relay deactivated after 500ms delay
- Can drops from tray to dispensing area
- Transaction logged with timestamp

#### Step 7: Transaction Complete

- Customer receives their can
- Machine returns to idle state
- Ready for next transaction

## Technical Implementation Details

### WebSocket Communication

- **Protocol**: WebSocket over WSS (secure)
- **Server**: LNbits with Bitcoin Switch extension
- **Message Format**: `"pin-duration"`
- **Reconnection**: Automatic every 60 seconds on disconnect

### GPIO Control

- **Library**: `onoff` for GPIO management
- **Input Pins**: Button press detection with debouncing
- **Output Pins**: Relay control for dispensing
- **Debounce Timeout**: 200ms to prevent false triggers

### Error Handling

- **Connection Loss**: Automatic reconnection attempts
- **Payment Failures**: Graceful handling of invalid messages
- **Hardware Errors**: Logging and recovery mechanisms
- **Process Management**: PM2 for auto-restart and monitoring

### Security Considerations

- **Environment Variables**: Sensitive data stored in `.env` file
- **GPIO Access**: Requires appropriate system permissions
- **Network Security**: WebSocket over secure connection
- **Input Validation**: Message parsing with error handling

## Configuration

### Required Environment Variables

```bash
LIGHTNING_LNBITS_URL=wss://your-lnbits-server.com/ws/switch
PIN_IN=[1,2,3,4,5,6,7,8]  # GPIO pins for button inputs
LABEL=["Coke","Pepsi","Sprite","Fanta","Water","Energy","Juice","Snack"]
```

### Hardware Setup

- Raspberry Pi 4 (recommended)
- GPIO breakout board
- Relay modules for each tray
- Physical buttons for each tray
- Power supply for relays

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   LNbits Server │    │  21UP Machine   │                │
│  │   (Cloud/Remote)│    │  (Raspberry Pi) │                │
│  │                 │    │                 │                │
│  │ • Lightning     │◄──►│ • WebSocket     │                │
│  │   Processing    │    │   Client        │                │
│  │ • Bitcoin Switch│    │ • GPIO Control  │                │
│  │ • WebSocket     │    │ • Hardware      │                │
│  │   Server        │    │   Interface     │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           │                       │                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Lightning     │    │   Physical      │                │
│  │   Network       │    │   Vending       │                │
│  │                 │    │   Machine       │                │
│  │ • Payment       │    │                 │                │
│  │   Routing       │    │ • Trays         │                │
│  │ • Invoice       │    │ • Buttons       │                │
│  │   Generation    │    │ • Relays        │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring and Maintenance

### Process Management

- **PM2**: Process monitoring and auto-restart
- **Logging**: Timestamped console output
- **Health Checks**: WebSocket connection monitoring

### Maintenance Tasks

- Regular hardware inspection
- GPIO pin cleaning
- Relay testing
- Network connectivity verification
- LNbits server status monitoring

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check network connectivity
   - Verify LNbits server status
   - Validate WebSocket URL format

2. **GPIO Access Denied**
   - Ensure user has GPIO permissions
   - Check hardware connections
   - Verify pin configurations

3. **Payment Not Detected**
   - Check LNbits Bitcoin Switch extension
   - Verify WebSocket message format
   - Monitor LNbits logs

4. **Dispensing Issues**
   - Test relay functionality
   - Check button connections
   - Verify pin mappings

## Future Enhancements

### Potential Improvements

- Multi-currency support (Bitcoin + Lightning)
- Inventory tracking and management
- Remote monitoring dashboard
- Customer analytics and reporting
- Integration with additional Lightning services
- Mobile app for machine management
