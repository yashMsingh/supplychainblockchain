const { ethers } = require("hardhat");

function short(address) {
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
}

function row(step, eventType, actor, location, timestamp) {
  const pad = (v, n) => String(v).padEnd(n, " ");
  return `| ${pad(step, 4)}| ${pad(eventType, 14)}| ${pad(location, 21)}| ${pad(short(actor), 20)}| ${pad(timestamp, 20)}|`;
}

async function main() {
  try {
    const [manufacturer, distributor, retailer] = await ethers.getSigners();

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = await SupplyChain.deploy();
    await supplyChain.waitForDeployment();

    console.log("Deploying demo contract at:", await supplyChain.getAddress());

    console.log("\n🏭 Step 1: Manufacturer creating iPhone 15 Pro...");
    await (await supplyChain.connect(manufacturer).createAsset(
      "IPHONE15-001",
      "iPhone 15 Pro",
      "Pune Factory",
      "Batch Jan 2025"
    )).wait();
    console.log("✅ Asset created! ProductId: IPHONE15-001");

    console.log("🔍 Step 2: Recording quality check...");
    await (await supplyChain.connect(manufacturer).recordEvent(
      "IPHONE15-001",
      "quality_check",
      "Pune QC Lab",
      "All 47 tests passed"
    )).wait();
    console.log("✅ Quality check recorded!");

    console.log("🚚 Step 3: Transferring to distributor...");
    await (await supplyChain.connect(manufacturer).transferAsset(
      "IPHONE15-001",
      distributor.address,
      "Mumbai Port",
      "Shipped via courier"
    )).wait();
    console.log(`✅ Transferred to: ${short(distributor.address)}`);

    console.log("📦 Step 4: Distributor recording processing...");
    await (await supplyChain.connect(distributor).recordEvent(
      "IPHONE15-001",
      "processing",
      "Mumbai Warehouse",
      "Stored in climate control"
    )).wait();
    console.log("✅ Processing event recorded!");

    console.log("🏪 Step 5: Transferring to retailer...");
    await (await supplyChain.connect(distributor).transferAsset(
      "IPHONE15-001",
      retailer.address,
      "Delhi Store",
      "Last mile delivery"
    )).wait();
    console.log(`✅ Transferred to: ${short(retailer.address)}`);

    console.log("✅ Step 6: Retailer confirming receipt...");
    await (await supplyChain.connect(retailer).recordEvent(
      "IPHONE15-001",
      "received",
      "Delhi Apple Store",
      "Stock updated"
    )).wait();
    console.log("✅ Received event recorded!");

    console.log("\n💻 Simulation 2: Dell XPS 15 shorter journey...");
    await (await supplyChain.connect(manufacturer).createAsset(
      "LAPTOP-DELL-002",
      "Dell XPS 15",
      "Bangalore Plant",
      "Batch Dell Jan 2025"
    )).wait();
    await (await supplyChain.connect(manufacturer).recordEvent(
      "LAPTOP-DELL-002",
      "quality_check",
      "Bangalore QC",
      "All tests passed"
    )).wait();
    await (await supplyChain.connect(manufacturer).transferAsset(
      "LAPTOP-DELL-002",
      distributor.address,
      "Chennai Hub",
      "Shipped to warehouse"
    )).wait();

    const history = await supplyChain.queryHistory("IPHONE15-001");
    console.log("\nFull History for IPHONE15-001:");
    console.log("┌─────┬───────────────┬──────────────────────┬──────────────────────┬──────────────────────┐");
    console.log("|Step | EventType     | Location             | Actor                | Timestamp            |");
    console.log("├─────┼───────────────┼──────────────────────┼──────────────────────┼──────────────────────┤");

    history.forEach((event, idx) => {
      const date = new Date(Number(event.timestamp) * 1000).toLocaleString("en-IN");
      console.log(row(idx + 1, event.eventType, event.actor, event.location, date));
    });

    console.log("└─────┴───────────────┴──────────────────────┴──────────────────────┴──────────────────────┘");

    const createdEvents = await supplyChain.queryFilter("AssetCreated").catch(async () => supplyChain.queryFilter(supplyChain.filters.AssetCreated()));
    const recordedEvents = await supplyChain.queryFilter("EventRecorded").catch(async () => supplyChain.queryFilter(supplyChain.filters.EventRecorded()));

    console.log(`\nTotal products created: ${createdEvents.length}`);
    console.log(`Total events recorded: ${recordedEvents.length}`);
    console.log("Demo simulation complete! ✅");
  } catch (error) {
    console.error("Simulation failed:", error);
    process.exitCode = 1;
  }
}

main();
