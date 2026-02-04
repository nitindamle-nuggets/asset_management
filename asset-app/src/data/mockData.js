/**
 * mockData.js
 * Sample data for dropdown fields and testing
 * 
 * In production, this data should be fetched from your backend API
 */

export const mockData = {
  // Account Heads
  accountHeads: [
    { id: 'ah001', name: 'Fixed Assets' },
    { id: 'ah002', name: 'Current Assets' },
    { id: 'ah003', name: 'Office Equipment' },
    { id: 'ah004', name: 'IT Infrastructure' },
    { id: 'ah005', name: 'Furniture & Fixtures' },
    { id: 'ah006', name: 'Vehicles' },
    { id: 'ah007', name: 'Plant & Machinery' }
  ],

  // Categories
  categories: [
    { id: 'cat001', name: 'Computer & Peripherals' },
    { id: 'cat002', name: 'Network Equipment' },
    { id: 'cat003', name: 'Furniture' },
    { id: 'cat004', name: 'Vehicles' },
    { id: 'cat005', name: 'Office Equipment' },
    { id: 'cat006', name: 'Manufacturing Equipment' },
    { id: 'cat007', name: 'HVAC & Utilities' },
    { id: 'cat008', name: 'Safety Equipment' }
  ],

  // Sub-categories (with category relationships)
  subCategories: [
    // Computer & Peripherals
    { id: 'sub001', categoryId: 'cat001', name: 'Laptops' },
    { id: 'sub002', categoryId: 'cat001', name: 'Desktop Computers' },
    { id: 'sub003', categoryId: 'cat001', name: 'Monitors' },
    { id: 'sub004', categoryId: 'cat001', name: 'Printers' },
    { id: 'sub005', categoryId: 'cat001', name: 'Scanners' },
    
    // Network Equipment
    { id: 'sub006', categoryId: 'cat002', name: 'Routers' },
    { id: 'sub007', categoryId: 'cat002', name: 'Switches' },
    { id: 'sub008', categoryId: 'cat002', name: 'Wireless Access Points' },
    { id: 'sub009', categoryId: 'cat002', name: 'Firewalls' },
    
    // Furniture
    { id: 'sub010', categoryId: 'cat003', name: 'Office Chairs' },
    { id: 'sub011', categoryId: 'cat003', name: 'Desks & Tables' },
    { id: 'sub012', categoryId: 'cat003', name: 'Storage Cabinets' },
    { id: 'sub013', categoryId: 'cat003', name: 'Meeting Room Furniture' },
    
    // Vehicles
    { id: 'sub014', categoryId: 'cat004', name: 'Cars' },
    { id: 'sub015', categoryId: 'cat004', name: 'Vans' },
    { id: 'sub016', categoryId: 'cat004', name: 'Trucks' },
    
    // Office Equipment
    { id: 'sub017', categoryId: 'cat005', name: 'Copiers' },
    { id: 'sub018', categoryId: 'cat005', name: 'Projectors' },
    { id: 'sub019', categoryId: 'cat005', name: 'Telephones' },
    { id: 'sub020', categoryId: 'cat005', name: 'Shredders' }
  ],

  // Asset Groups (with sub-category relationships)
  assetGroups: [
    // Laptops
    { id: 'grp001', subCategoryId: 'sub001', name: 'Business Laptops' },
    { id: 'grp002', subCategoryId: 'sub001', name: 'Gaming Laptops' },
    { id: 'grp003', subCategoryId: 'sub001', name: 'Ultrabooks' },
    
    // Desktop Computers
    { id: 'grp004', subCategoryId: 'sub002', name: 'Workstations' },
    { id: 'grp005', subCategoryId: 'sub002', name: 'All-in-One PCs' },
    { id: 'grp006', subCategoryId: 'sub002', name: 'Mini PCs' },
    
    // Monitors
    { id: 'grp007', subCategoryId: 'sub003', name: 'LED Monitors' },
    { id: 'grp008', subCategoryId: 'sub003', name: 'LCD Monitors' },
    
    // Printers
    { id: 'grp009', subCategoryId: 'sub004', name: 'Laser Printers' },
    { id: 'grp010', subCategoryId: 'sub004', name: 'Inkjet Printers' },
    { id: 'grp011', subCategoryId: 'sub004', name: 'Multi-function Printers' },
    
    // Office Chairs
    { id: 'grp012', subCategoryId: 'sub010', name: 'Executive Chairs' },
    { id: 'grp013', subCategoryId: 'sub010', name: 'Task Chairs' },
    { id: 'grp014', subCategoryId: 'sub010', name: 'Conference Chairs' }
  ],

  // Asset Models
  assetModels: [
    // Laptops
    { id: 'mod001', name: 'Dell Latitude 7420' },
    { id: 'mod002', name: 'HP EliteBook 840 G9' },
    { id: 'mod003', name: 'Lenovo ThinkPad X1 Carbon Gen 11' },
    { id: 'mod004', name: 'MacBook Pro 16-inch M3' },
    
    // Desktops
    { id: 'mod005', name: 'Dell OptiPlex 7090' },
    { id: 'mod006', name: 'HP EliteDesk 800 G9' },
    { id: 'mod007', name: 'Lenovo ThinkCentre M90t' },
    
    // Monitors
    { id: 'mod008', name: 'Dell UltraSharp U2723DE' },
    { id: 'mod009', name: 'LG 27UP850-W' },
    { id: 'mod010', name: 'Samsung S27A600U' },
    
    // Printers
    { id: 'mod011', name: 'HP LaserJet Enterprise M607' },
    { id: 'mod012', name: 'Canon imageCLASS LBP226dw' },
    { id: 'mod013', name: 'Epson EcoTank ET-4850' },
    
    // Furniture
    { id: 'mod014', name: 'Steelcase Gesture Chair' },
    { id: 'mod015', name: 'Herman Miller Aeron' },
    { id: 'mod016', name: 'Ikea BEKANT Desk' }
  ],

  // Manufacturers
  manufacturers: [
    { id: 'mfr001', name: 'Dell' },
    { id: 'mfr002', name: 'HP' },
    { id: 'mfr003', name: 'Lenovo' },
    { id: 'mfr004', name: 'Apple' },
    { id: 'mfr005', name: 'Samsung' },
    { id: 'mfr006', name: 'LG' },
    { id: 'mfr007', name: 'Canon' },
    { id: 'mfr008', name: 'Epson' },
    { id: 'mfr009', name: 'Cisco' },
    { id: 'mfr010', name: 'Steelcase' },
    { id: 'mfr011', name: 'Herman Miller' },
    { id: 'mfr012', name: 'Ikea' },
    { id: 'mfr013', name: 'Microsoft' },
    { id: 'mfr014', name: 'Asus' },
    { id: 'mfr015', name: 'Acer' }
  ],

  // Departments
  departments: [
    { id: 'dept001', name: 'Information Technology' },
    { id: 'dept002', name: 'Finance & Accounting' },
    { id: 'dept003', name: 'Human Resources' },
    { id: 'dept004', name: 'Operations' },
    { id: 'dept005', name: 'Sales & Marketing' },
    { id: 'dept006', name: 'Production' },
    { id: 'dept007', name: 'Quality Assurance' },
    { id: 'dept008', name: 'Research & Development' },
    { id: 'dept009', name: 'Customer Service' },
    { id: 'dept010', name: 'Administration' }
  ],

  // Cost Centers
  costCenters: [
    { id: 'cc001', name: 'CC-IT-001 - IT Infrastructure' },
    { id: 'cc002', name: 'CC-FIN-001 - Finance Department' },
    { id: 'cc003', name: 'CC-HR-001 - Human Resources' },
    { id: 'cc004', name: 'CC-OPS-001 - Operations' },
    { id: 'cc005', name: 'CC-SAL-001 - Sales' },
    { id: 'cc006', name: 'CC-MKT-001 - Marketing' },
    { id: 'cc007', name: 'CC-PRD-001 - Production' },
    { id: 'cc008', name: 'CC-QA-001 - Quality Control' },
    { id: 'cc009', name: 'CC-RND-001 - R&D' },
    { id: 'cc010', name: 'CC-ADM-001 - Administration' }
  ],

  // Locations
  locations: [
    { id: 'loc001', name: 'Headquarters - Mumbai' },
    { id: 'loc002', name: 'Branch Office - Delhi' },
    { id: 'loc003', name: 'Branch Office - Bangalore' },
    { id: 'loc004', name: 'Branch Office - Chennai' },
    { id: 'loc005', name: 'Branch Office - Hyderabad' },
    { id: 'loc006', name: 'Branch Office - Pune' },
    { id: 'loc007', name: 'Warehouse - Thane' },
    { id: 'loc008', name: 'Warehouse - Gurgaon' },
    { id: 'loc009', name: 'Manufacturing Plant - Gujarat' },
    { id: 'loc010', name: 'Data Center - Navi Mumbai' }
  ]
};

/**
 * Helper function to get sub-categories for a category
 * @param {string} categoryId 
 * @returns {Array}
 */
export const getSubCategoriesByCategory = (categoryId) => {
  return mockData.subCategories.filter(sc => sc.categoryId === categoryId);
};

/**
 * Helper function to get asset groups for a sub-category
 * @param {string} subCategoryId 
 * @returns {Array}
 */
export const getAssetGroupsBySubCategory = (subCategoryId) => {
  return mockData.assetGroups.filter(ag => ag.subCategoryId === subCategoryId);
};

/**
 * Sample barcode validation function
 * @param {string} barcode 
 * @returns {boolean}
 */
export const validateBarcode = (barcode) => {
  // Basic validation - in production, check against database
  return barcode && barcode.length >= 6;
};

/**
 * Generate a unique asset ID
 * @param {string} prefix 
 * @returns {string}
 */
export const generateAssetId = (prefix = 'AST') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};
