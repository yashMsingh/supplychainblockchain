// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    struct Product {
        string productId;
        string name;
        address currentOwner;
        bool exists;
    }

    struct SupplyEvent {
        string eventType;
        address actor;
        string location;
        uint256 timestamp;
        string notes;
    }

    mapping(string => Product) private products;
    mapping(string => SupplyEvent[]) private productHistory;

    event AssetCreated(string indexed productId, string name, address indexed owner);
    event AssetTransferred(string indexed productId, address indexed from, address indexed to, string location);
    event EventRecorded(string indexed productId, string eventType);

    modifier productMustExist(string memory productId) {
        require(products[productId].exists, "SupplyChain: Product does not exist");
        _;
    }

    modifier onlyProductOwner(string memory productId) {
        require(products[productId].currentOwner == msg.sender, "SupplyChain: Caller is not the product owner");
        _;
    }

    /// @notice Creates a new supply chain asset and records its creation event.
    /// @param productId Unique product identifier.
    /// @param name Product name.
    /// @param location Location where asset is created.
    /// @param notes Additional metadata or remarks.
    function createAsset(
        string memory productId,
        string memory name,
        string memory location,
        string memory notes
    ) public {
        require(!products[productId].exists, "SupplyChain: Product already exists");
        require(bytes(productId).length > 0, "SupplyChain: Product ID cannot be empty");
        require(bytes(name).length > 0, "SupplyChain: Product name cannot be empty");

        products[productId] = Product({
            productId: productId,
            name: name,
            currentOwner: msg.sender,
            exists: true
        });

        productHistory[productId].push(
            SupplyEvent({
                eventType: "created",
                actor: msg.sender,
                location: location,
                timestamp: block.timestamp,
                notes: notes
            })
        );

        emit AssetCreated(productId, name, msg.sender);
    }

    /// @notice Transfers ownership of an existing asset and records transfer event.
    /// @param productId Product identifier.
    /// @param newOwner Address of the new owner.
    /// @param location Location where transfer occurred.
    /// @param notes Additional transfer notes.
    function transferAsset(
        string memory productId,
        address newOwner,
        string memory location,
        string memory notes
    ) public productMustExist(productId) onlyProductOwner(productId) {
        require(newOwner != address(0), "SupplyChain: New owner cannot be zero address");
        require(newOwner != msg.sender, "SupplyChain: Cannot transfer to yourself");

        address previousOwner = products[productId].currentOwner;
        products[productId].currentOwner = newOwner;

        productHistory[productId].push(
            SupplyEvent({
                eventType: "transferred",
                actor: msg.sender,
                location: location,
                timestamp: block.timestamp,
                notes: notes
            })
        );

        emit AssetTransferred(productId, previousOwner, newOwner, location);
    }

    /// @notice Records an arbitrary lifecycle event for an existing product.
    /// @param productId Product identifier.
    /// @param eventType Event type label (e.g. quality_check, processing).
    /// @param location Location where event occurred.
    /// @param notes Additional event details.
    function recordEvent(
        string memory productId,
        string memory eventType,
        string memory location,
        string memory notes
    ) public productMustExist(productId) {
        require(bytes(eventType).length > 0, "SupplyChain: Event type cannot be empty");

        productHistory[productId].push(
            SupplyEvent({
                eventType: eventType,
                actor: msg.sender,
                location: location,
                timestamp: block.timestamp,
                notes: notes
            })
        );

        emit EventRecorded(productId, eventType);
    }

    /// @notice Returns the full history of events for a product.
    /// @param productId Product identifier.
    /// @return Full event array for the specified product.
    function queryHistory(string memory productId)
        public
        view
        productMustExist(productId)
        returns (SupplyEvent[] memory)
    {
        return productHistory[productId];
    }

    /// @notice Returns product metadata and current ownership details.
    /// @param productId Product identifier.
    /// @return Product struct for the specified product.
    function getProduct(string memory productId)
        public
        view
        productMustExist(productId)
        returns (Product memory)
    {
        return products[productId];
    }

    /// @notice Checks whether a product exists in the system.
    /// @param productId Product identifier.
    /// @return True if the product exists, false otherwise.
    function productExists(string memory productId) public view returns (bool) {
        return products[productId].exists;
    }
}