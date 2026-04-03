# Blockchain-Based Supply Chain Transparency System

## Team
- Yashkumar Singh (372014)
- Aayush Gaikwad (372016)
- Dheeraj Borse (372029)
- Atharv Kale (372038)

## Course
Blockchain Technology - VIIT Pune

## 1. Project Description (Detailed)
This project is a complete end-to-end decentralized application (DApp) for tracking products across a supply chain lifecycle. It is designed to demonstrate how blockchain can solve real trust problems in logistics and inventory systems.

In traditional supply chains, records are often kept in centralized systems controlled by one organization. That creates multiple risks:
- Data can be changed or deleted intentionally or accidentally.
- Stakeholders may not trust each other's records.
- Audits are slow because event data is spread across disconnected systems.

This system solves those problems by storing critical supply chain records on blockchain through a Solidity smart contract. Every major product activity is recorded as an immutable event:
- Product creation by manufacturer.
- Ownership transfer between parties.
- Lifecycle operations like quality check, processing, dispatch, received, etc.

Once a transaction is mined:
- Event data becomes tamper-resistant.
- A complete historical timeline is available.
- Stakeholders can independently verify what happened, when it happened, and who performed it.

The solution includes:
- Smart contract business logic (`SupplyChain.sol`).
- Local Ethereum development blockchain via Hardhat.
- Automated test suite (29 passing tests).
- Deployment and simulation scripts.
- React frontend integrated with MetaMask and ethers.js for transaction signing and on-chain reads.

## 2. Key Features
- Register products with unique ID, name, location, and notes.
- Transfer ownership with strict authorization checks.
- Record custom lifecycle events for traceability.
- Query complete event history per product.
- Display product metadata with current owner.
- Live dashboard that aggregates on-chain events.
- Wallet-aware UI with connection guards, transaction feedback, and network warning.

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Solidity 0.8.20 |
| Blockchain Dev Environment | Hardhat |
| Testing | Mocha + Chai + Hardhat Ethers |
| Frontend | React + React Router |
| Wallet Integration | MetaMask + ethers BrowserProvider |
| Notifications / UX | react-hot-toast, react-icons |
| Local Chain | Hardhat Node (RPC: `http://127.0.0.1:8545`, Chain ID: `31337`) |

## 4. Project Structure

```text
supply-chain-blockchain/
|- contracts/
|  |- SupplyChain.sol                 # Core smart contract
|- scripts/
|  |- deploy.js                       # Contract deployment script
|  |- simulate.js                     # End-to-end demo flow simulation
|- test/
|  |- SupplyChain.test.js             # Comprehensive smart contract tests (29)
|- frontend/
|  |- public/
|  |- src/
|  |  |- components/                  # Reusable UI components
|  |  |- context/                     # Wallet context provider
|  |  |- hooks/                       # Wallet + contract hooks
|  |  |- pages/                       # Route pages (home, create, transfer, etc.)
|  |  |- utils/                       # Contract helpers, formatters
|  |  |- contractConfig.js            # ABI + deployed contract address
|  |  |- App.js                       # Main app routing and providers
|  |  |- index.css                    # App styling
|  |  |- index.js                     # React entry point
|  |- package.json
|- hardhat.config.js
|- package.json
|- README.md
```

## 5. Smart Contract Design

### 5.1 Data Models
- `Product`
	- `productId` (string)
	- `name` (string)
	- `currentOwner` (address)
	- `exists` (bool)

- `SupplyEvent`
	- `eventType` (string)
	- `actor` (address)
	- `location` (string)
	- `timestamp` (uint256)
	- `notes` (string)

### 5.2 Storage
- `mapping(string => Product) products`
- `mapping(string => SupplyEvent[]) productHistory`

### 5.3 Access Control and Safety
- `productMustExist(productId)` modifier.
- `onlyProductOwner(productId)` modifier.
- Input validation checks for duplicate product, empty fields, zero address, and self-transfer.

### 5.4 Public Functions
| Function | Parameters | Purpose |
|---|---|---|
| `createAsset` | `productId`, `name`, `location`, `notes` | Creates product and logs initial `created` event |
| `transferAsset` | `productId`, `newOwner`, `location`, `notes` | Transfers ownership and logs transfer event |
| `recordEvent` | `productId`, `eventType`, `location`, `notes` | Adds lifecycle event to product history |
| `queryHistory` | `productId` | Returns full `SupplyEvent[]` timeline |
| `getProduct` | `productId` | Returns current product metadata |
| `productExists` | `productId` | Returns existence boolean |

### 5.5 Emitted Events
- `AssetCreated(string indexed productId, string name, address indexed owner)`
- `AssetTransferred(string indexed productId, address indexed from, address indexed to, string location)`
- `EventRecorded(string indexed productId, string eventType)`

## 6. Frontend Flow

### 6.1 Pages
| Route | Page | Purpose |
|---|---|---|
| `/` | Home | System overview and feature entry points |
| `/dashboard` | Dashboard | Live analytics from on-chain events |
| `/create` | CreateAsset | Register new product |
| `/transfer` | TransferAsset | Transfer ownership |
| `/record` | RecordEvent | Record lifecycle milestone |
| `/history` | ViewHistory | Query full product timeline |

### 6.2 Frontend Architecture
- `WalletProvider` manages wallet connection state.
- `useWallet` handles MetaMask connect/disconnect + network state.
- `useContract` centralizes transaction and read calls.
- `WalletGuard` protects pages requiring connection.
- `TransactionStatus` and toast notifications provide real-time UX feedback.

## 7. Local Development Setup (Windows, Detailed)

Follow this exact sequence on your local device.

### 7.1 Prerequisites
1. Install Node.js (recommended: 20+; project was tested with Node 24).
2. Ensure npm is available.
3. Install MetaMask browser extension.
4. Use PowerShell terminal (VS Code recommended).

### 7.2 Verify Installed Versions
```powershell
node -v
npm -v
```

### 7.3 Install Dependencies
From project root:
```powershell
npm install
Set-Location frontend
npm install
Set-Location ..
```

### 7.4 Start Local Blockchain (Terminal 1)
```powershell
Set-Location "c:\Users\singh\OneDrive\Desktop\SEM 6TH\BT\supply-chain-blockchain"
npx hardhat node
```

Keep this terminal running. It hosts your local chain and test accounts.

### 7.5 Compile and Test (Terminal 2)
```powershell
Set-Location "c:\Users\singh\OneDrive\Desktop\SEM 6TH\BT\supply-chain-blockchain"
npx hardhat compile
npx hardhat test
```

Expected test summary:
```text
29 passing
```

### 7.6 Deploy Contract on Localhost (Terminal 2)
```powershell
npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed contract address from output.

### 7.7 Update Frontend Contract Address
Open `frontend/src/contractConfig.js` and set:
- `CONTRACT_ADDRESS` = the address printed by deploy script.

If ABI is already aligned and unchanged, no additional action is needed.

### 7.8 Configure MetaMask for Hardhat Network
In MetaMask:
1. Add a custom network:
	 - Network Name: Hardhat Local
	 - RPC URL: `http://127.0.0.1:8545`
	 - Chain ID: `31337`
	 - Currency Symbol: ETH
2. Import one Hardhat account using the private key shown in Terminal 1.
3. Switch MetaMask to Hardhat Local network.

### 7.9 Run Frontend (Terminal 3)
```powershell
Set-Location "c:\Users\singh\OneDrive\Desktop\SEM 6TH\BT\supply-chain-blockchain\frontend"
npm start
```

Open:
- `http://localhost:3000`

### 7.10 Recommended Terminal Layout
- Terminal 1: `npx hardhat node`
- Terminal 2: compile/test/deploy/simulate commands
- Terminal 3: frontend (`npm start`)

## 8. Demo Walkthrough (Manual)
1. Connect MetaMask from navbar.
2. Go to Create page and create product `IPHONE15-001`.
3. Record `quality_check` event.
4. Transfer ownership to another account.
5. Record additional events (processing, dispatch, received).
6. Open History page and verify full immutable timeline.
7. Open Dashboard to inspect global event activity.

## 9. Demo Simulation Script
To run a scripted end-to-end journey:
```powershell
Set-Location "c:\Users\singh\OneDrive\Desktop\SEM 6TH\BT\supply-chain-blockchain"
npx hardhat run scripts/simulate.js --network localhost
```

This script creates sample products, performs transfers, records lifecycle events, and prints a structured history table.

## 10. Testing Strategy
The test suite validates:
- Deployment correctness.
- Product creation validation and event emission.
- Ownership transfer permissions and revert scenarios.
- Event recording and edge cases.
- History ordering and data integrity.
- Product lookup and existence checks.
- Full real-world-like manufacturer-to-retailer flow.

Run tests anytime:
```powershell
npx hardhat test
```

## 11. Common Local Issues and Fixes

### MetaMask connection fails
- Ensure MetaMask extension is unlocked.
- Ensure Hardhat local network is selected.
- If multiple wallet extensions are installed, disable others and retry.

### Wrong network warning in UI
- Switch MetaMask to Chain ID `31337`.

### Transaction reverted
- Verify product exists before transfer/record.
- Verify caller is current owner for ownership transfer.
- Verify event type and input fields are non-empty.

### Contract calls wrong address
- Re-run deploy and update `CONTRACT_ADDRESS` in frontend config.

### Port 3000 already in use
- Stop existing process on port 3000 or run frontend on alternate port when prompted.

## 12. Architecture Summary
This project uses a layered architecture:
- Presentation Layer: React pages and reusable components.
- Interaction Layer: MetaMask + ethers for signing and reads.
- Business Logic Layer: Solidity contract with ownership and history rules.
- Data Layer: Immutable blockchain ledger storing all product lifecycle events.

The result is a verifiable, auditable, and tamper-resistant supply chain tracking system suitable for academic demonstration and extensible to enterprise prototypes.
