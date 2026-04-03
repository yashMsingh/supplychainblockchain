const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
  let supplyChain;
  let owner;
  let addr1;
  let addr2;

  const productId = "PROD001";
  const name = "iPhone 15";
  const location = "Mumbai Factory";
  const notes = "Batch A";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplyChain = await SupplyChain.deploy();
    await supplyChain.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy contract successfully", async function () {
      const address = await supplyChain.getAddress();
      expect(address).to.not.equal(null);
      expect(address).to.not.equal(ethers.ZeroAddress);
    });

    it("Should set deployer as first signer", async function () {
      expect(owner.address).to.properAddress;
    });
  });

  describe("createAsset", function () {
    it("Should create a new product successfully", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      const product = await supplyChain.getProduct(productId);
      expect(product.productId).to.equal(productId);
      expect(product.name).to.equal(name);
      expect(product.currentOwner).to.equal(owner.address);
      expect(product.exists).to.equal(true);
    });

    it("Should store creation event in history", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      const history = await supplyChain.queryHistory(productId);
      expect(history.length).to.equal(1);
      expect(history[0].eventType).to.equal("created");
      expect(history[0].actor).to.equal(owner.address);
      expect(history[0].location).to.equal(location);
      expect(history[0].notes).to.equal(notes);
      expect(history[0].timestamp).to.be.gt(0n);
    });

    it("Should emit AssetCreated event", async function () {
      await expect(
        supplyChain.createAsset(productId, name, location, notes)
      )
        .to.emit(supplyChain, "AssetCreated")
        .withArgs(productId, name, owner.address);
    });

    it("Should reject duplicate product creation", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      await expect(
        supplyChain.createAsset(productId, name, location, notes)
      ).to.be.revertedWith("SupplyChain: Product already exists");
    });

    it("Should reject empty productId", async function () {
      await expect(
        supplyChain.createAsset("", name, location, notes)
      ).to.be.revertedWith("SupplyChain: Product ID cannot be empty");
    });

    it("Should reject empty product name", async function () {
      await expect(
        supplyChain.createAsset(productId, "", location, notes)
      ).to.be.revertedWith("SupplyChain: Product name cannot be empty");
    });
  });

  describe("transferAsset", function () {
    it("Should transfer product to new owner", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      await supplyChain.transferAsset(
        productId,
        addr1.address,
        "Delhi Warehouse",
        "First transfer"
      );

      const product = await supplyChain.getProduct(productId);
      expect(product.currentOwner).to.equal(addr1.address);
    });

    it("Should store transfer event in history", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      await supplyChain.transferAsset(
        productId,
        addr1.address,
        "Delhi Warehouse",
        "First transfer"
      );

      const history = await supplyChain.queryHistory(productId);
      expect(history.length).to.equal(2);
      expect(history[1].eventType).to.equal("transferred");
      expect(history[1].actor).to.equal(owner.address);
      expect(history[1].location).to.equal("Delhi Warehouse");
    });

    it("Should emit AssetTransferred event", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      await expect(
        supplyChain.transferAsset(
          productId,
          addr1.address,
          "Delhi Warehouse",
          "First transfer"
        )
      )
        .to.emit(supplyChain, "AssetTransferred")
        .withArgs(productId, owner.address, addr1.address, "Delhi Warehouse");
    });

    it("Should reject transfer from non-owner", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      await expect(
        supplyChain
          .connect(addr1)
          .transferAsset(productId, addr2.address, "Delhi Warehouse", "Unauthorized")
      ).to.be.revertedWith("SupplyChain: Caller is not the product owner");
    });

    it("Should reject transfer to zero address", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      await expect(
        supplyChain.transferAsset(
          productId,
          ethers.ZeroAddress,
          "Delhi Warehouse",
          "Invalid transfer"
        )
      ).to.be.revertedWith("SupplyChain: New owner cannot be zero address");
    });

    it("Should reject transfer to yourself", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      await expect(
        supplyChain.transferAsset(
          productId,
          owner.address,
          "Delhi Warehouse",
          "Self transfer"
        )
      ).to.be.revertedWith("SupplyChain: Cannot transfer to yourself");
    });

    it("Should reject transfer of non-existent product", async function () {
      await expect(
        supplyChain.transferAsset(
          "FAKE999",
          addr1.address,
          "Delhi Warehouse",
          "Fake product"
        )
      ).to.be.revertedWith("SupplyChain: Product does not exist");
    });
  });

  describe("recordEvent", function () {
    it("Should record a quality check event", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      await supplyChain.recordEvent(
        productId,
        "quality_check",
        "Pune QC Lab",
        "All tests passed"
      );

      const history = await supplyChain.queryHistory(productId);
      expect(history.length).to.equal(2);
      expect(history[1].eventType).to.equal("quality_check");
      expect(history[1].location).to.equal("Pune QC Lab");
      expect(history[1].notes).to.equal("All tests passed");
    });

    it("Should record a processing event", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      await supplyChain.recordEvent(
        productId,
        "processing",
        "Chennai Port",
        "Ready for shipping"
      );

      const history = await supplyChain.queryHistory(productId);
      expect(history[1].eventType).to.equal("processing");
    });

    it("Should emit EventRecorded event", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      await expect(
        supplyChain.recordEvent(productId, "quality_check", "Pune QC Lab", "All tests passed")
      )
        .to.emit(supplyChain, "EventRecorded")
        .withArgs(productId, "quality_check");
    });

    it("Should reject event on non-existent product", async function () {
      await expect(
        supplyChain.recordEvent("FAKE999", "quality_check", "Pune QC Lab", "Invalid")
      ).to.be.revertedWith("SupplyChain: Product does not exist");
    });

    it("Should reject empty eventType", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      await expect(
        supplyChain.recordEvent(productId, "", "Pune QC Lab", "Invalid event")
      ).to.be.revertedWith("SupplyChain: Event type cannot be empty");
    });
  });

  describe("queryHistory", function () {
    it("Should return full history in correct order", async function () {
      await supplyChain.createAsset(productId, name, location, notes);
      await supplyChain.transferAsset(productId, addr1.address, "Delhi Warehouse", "First transfer");
      await supplyChain.connect(addr1).recordEvent(productId, "quality_check", "Pune QC Lab", "QC done");

      const history = await supplyChain.queryHistory(productId);
      expect(history.length).to.equal(3);
      expect(history[0].eventType).to.equal("created");
      expect(history[1].eventType).to.equal("transferred");
      expect(history[2].eventType).to.equal("quality_check");
    });

    it("Should return correct actor addresses", async function () {
      await supplyChain.createAsset(productId, name, location, notes);
      await supplyChain.transferAsset(productId, addr1.address, "Delhi Warehouse", "First transfer");
      await supplyChain.connect(addr1).recordEvent(productId, "processing", "Mumbai Hub", "Processed");

      const history = await supplyChain.queryHistory(productId);
      expect(history[0].actor).to.equal(owner.address);
      expect(history[1].actor).to.equal(owner.address);
      expect(history[2].actor).to.equal(addr1.address);
    });

    it("Should reject queryHistory for non-existent product", async function () {
      await expect(supplyChain.queryHistory("FAKE999")).to.be.revertedWith(
        "SupplyChain: Product does not exist"
      );
    });
  });

  describe("getProduct", function () {
    it("Should return correct product details", async function () {
      await supplyChain.createAsset(productId, name, location, notes);

      const product = await supplyChain.getProduct(productId);
      expect(product.productId).to.equal(productId);
      expect(product.name).to.equal(name);
      expect(product.currentOwner).to.equal(owner.address);
      expect(product.exists).to.equal(true);
    });

    it("Should reflect updated owner after transfer", async function () {
      await supplyChain.createAsset(productId, name, location, notes);
      await supplyChain.transferAsset(productId, addr1.address, "Delhi Warehouse", "First transfer");

      const product = await supplyChain.getProduct(productId);
      expect(product.currentOwner).to.equal(addr1.address);
    });

    it("Should reject getProduct for non-existent product", async function () {
      await expect(supplyChain.getProduct("FAKE999")).to.be.revertedWith(
        "SupplyChain: Product does not exist"
      );
    });
  });

  describe("productExists", function () {
    it("Should return false before creation", async function () {
      expect(await supplyChain.productExists(productId)).to.equal(false);
    });

    it("Should return true after creation", async function () {
      await supplyChain.createAsset(productId, name, location, notes);
      expect(await supplyChain.productExists(productId)).to.equal(true);
    });
  });

  describe("Full Supply Chain Flow", function () {
    it("Should simulate complete manufacturer to retailer flow", async function () {
      await supplyChain.createAsset("PROD001", "iPhone 15", "Pune Factory", "Manufactured");
      await supplyChain.recordEvent("PROD001", "quality_check", "Pune QC", "Passed QC");
      await supplyChain.transferAsset(
        "PROD001",
        addr1.address,
        "Mumbai Port",
        "Shipped to distributor"
      );
      await supplyChain
        .connect(addr1)
        .recordEvent("PROD001", "processing", "Mumbai Warehouse", "In warehouse");
      await supplyChain
        .connect(addr1)
        .transferAsset("PROD001", addr2.address, "Delhi Store", "Delivered to retailer");

      const product = await supplyChain.getProduct("PROD001");
      expect(product.currentOwner).to.equal(addr2.address);

      const history = await supplyChain.queryHistory("PROD001");
      expect(history.length).to.equal(5);
      expect(history[0].eventType).to.equal("created");
      expect(history[1].eventType).to.equal("quality_check");
      expect(history[2].eventType).to.equal("transferred");
      expect(history[3].eventType).to.equal("processing");
      expect(history[4].eventType).to.equal("transferred");
    });
  });
});
