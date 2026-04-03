export const DEMO_PRODUCTS = [
  {
    productId: "IPHONE15-001",
    name: "iPhone 15 Pro",
    scenario: [
      "manufacturer(Pune)",
      "quality_check",
      "transfer(Mumbai Distributor)",
      "processing",
      "transfer(Delhi Retailer)",
      "received"
    ]
  },
  {
    productId: "LAPTOP-DELL-002",
    name: "Dell XPS 15",
    scenario: [
      "manufacturer(Bangalore)",
      "inspection",
      "transfer(Chennai Warehouse)",
      "packaging",
      "dispatch",
      "transfer(Hyderabad Store)"
    ]
  },
  {
    productId: "TSHIRT-COTTON-003",
    name: "Organic Cotton T-Shirt",
    scenario: [
      "manufacturer(Surat Factory)",
      "quality_check",
      "processing",
      "transfer(Mumbai Hub)",
      "packaging",
      "transfer(Pune Store)"
    ]
  }
];

export const DEMO_ACCOUNTS = {
  manufacturer: "Account 0 - Manufacturer",
  distributor: "Account 1 - Distributor",
  retailer: "Account 2 - Retailer"
};

export const DEMO_LOCATIONS = [
  "Pune Factory",
  "Mumbai Port",
  "Delhi Warehouse",
  "Chennai Hub",
  "Bangalore Plant",
  "Hyderabad Store",
  "Surat Factory",
  "Kolkata Depot",
  "Ahmedabad Center"
];
