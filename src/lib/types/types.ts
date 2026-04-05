// ============================================================
// ARTISAN OPS — Master Type Definitions
// ============================================================

// ─────────────────────────────────────────
// ENUMS / UNION TYPES
// ─────────────────────────────────────────

export type StockStatus = 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';

export type StockLevel = 'HIGH' | 'NORMAL' | 'LOW' | 'OUT';

export type WarehouseId = 'north' | 'east' | 'central';

export type SortField =
  | 'name'
  | 'sku'
  | 'currentStock'
  | 'lastUpdated'
  | 'supplier'
  | 'location';

export type SortDirection = 'asc' | 'desc';

export type FilterTab = 'all' | 'low_stock' | 'in_transit';

export type BulkAction =
  | 'export'
  | 'delete'
  | 'reorder'
  | 'update_location'
  | 'assign_supplier';

export type NavItem = 'admin_home' | 'inventory_management' | 'warehouse_map' | 'supply_reports';

// ─────────────────────────────────────────
// LOCATION
// ─────────────────────────────────────────

export interface WarehouseLocation {
  aisle: string;       // e.g. "Aisle 4"
  shelf: string;       // e.g. "Shelf B" | "Floor" | "Rack 4" | "Bin 9"
  warehouse: string;   // e.g. "North Warehouse" | "East Warehouse" | "Central Hub"
  warehouseId: WarehouseId;
}

// ─────────────────────────────────────────
// INVENTORY ITEM
// ─────────────────────────────────────────

export interface InventoryItem {
  id: string;
  name: string;
  category: string;       // e.g. "CERAMICS"
  subCategory: string;    // e.g. "HOME DECOR"
  sku: string;            // e.g. "ART-7729-CV"
  currentStock: number;
  stockLevel: StockLevel;
  status: StockStatus;
  location: WarehouseLocation;
  supplier: string;
  lastUpdated: string;    // formatted string, e.g. "Today, 09:42 AM" | "Oct 24, 2023"
  imageUrl?: string;
}

// ─────────────────────────────────────────
// TABLE / FILTER STATE
// ─────────────────────────────────────────

export interface InventoryFilter {
  tab: FilterTab;
  category: string | null;    // null = All Categories
  warehouseId: WarehouseId | null; // null = All Warehouses
  dateRange: DateRange | null;
  search: string;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface PaginationState {
  currentPage: number;
  perPage: number;        // default 25
  totalItems: number;
  totalPages: number;
}

// ─────────────────────────────────────────
// TABLE
// ─────────────────────────────────────────

export interface TableColumn {
  key: SortField | 'itemDetail' | 'actions';
  label: string;
  sortable: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;         // e.g. "w-48"
}

export interface InventoryTableState {
  items: InventoryItem[];
  selectedIds: Set<string>;
  filter: InventoryFilter;
  sort: SortState;
  pagination: PaginationState;
  isLoading: boolean;
}

// ─────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────

export interface RowAction {
  id: 'view' | 'history' | 'edit' | 'reorder';
  label: string;
  icon: string;           // icon name / identifier
}

export interface BulkActionOption {
  id: BulkAction;
  label: string;
  destructive?: boolean;
}

// ─────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────

export interface NavMenuItem {
  id: NavItem;
  label: string;
  href: string;
  icon: string;
}

// ─────────────────────────────────────────
// API RESPONSE
// ─────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationState;
}

// ─────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
}