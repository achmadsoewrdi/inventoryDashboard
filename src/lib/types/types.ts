// ============================================================
// ARTISAN OPS — Master Type Definitions
// ============================================================

// ─────────────────────────────────────────
// ENUMS / UNION TYPES
// ─────────────────────────────────────────

// Disesuaikan dengan enum Prisma (underscore)
export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

// Helper untuk display label di UI
export const StockStatusLabel: Record<StockStatus, string> = {
  IN_STOCK: 'IN STOCK',
  LOW_STOCK: 'LOW STOCK',
  OUT_OF_STOCK: 'OUT OF STOCK',
};

export type SortField =
  | 'name'
  | 'sku'
  | 'currentStock'
  | 'updatedAt'
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

export type NavItem =
  | 'admin_home'
  | 'inventory_management'
  | 'warehouse_map'
  | 'supply_reports';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// ─────────────────────────────────────────
// BACKEND RESPONSE SHAPES
// Sesuai dengan Prisma include di product.service.ts
// ─────────────────────────────────────────

export interface CategoryResponse {
  id: number;
  name: string;           // e.g. "CERAMICS"
  subCategory: string;    // e.g. "HOME DECOR"
}

export interface SupplierResponse {
  id: number;
  name: string;           // e.g. "Artisan Clayworks Co."
}

export interface WarehouseResponse {
  id: number;
  name: string;           // e.g. "North Warehouse"
}

export interface ProductImageResponse {
  id: number;
  url: string;
  isPrimary: boolean;
}

export interface ProductLocationResponse {
  aisle: string;          // e.g. "Aisle 4"
  shelf: string;          // e.g. "Shelf B"
  warehouse: WarehouseResponse;
}

// Shape lengkap dari GET /api/products/:id
export interface InventoryItemResponse {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  basePrice: number;
  salePrice: number;
  currentStock: number;
  stockThreshold: number;
  status: StockStatus;
  category: CategoryResponse;
  supplier: SupplierResponse;
  images: ProductImageResponse[];
  location: ProductLocationResponse | null;
  createdAt: string;
  updatedAt: string;
}

// Shape dari GET /api/products (list)
export interface InventoryListResponse {
  data: InventoryItemResponse[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─────────────────────────────────────────
// FRONTEND VIEW MODEL
// Hasil transform dari InventoryItemResponse
// untuk dipakai di component
// ─────────────────────────────────────────

export interface InventoryItem {
  id: number;
  name: string;
  category: string;         // dari category.name
  subCategory: string;      // dari category.subCategory
  sku: string;
  currentStock: number;
  stockThreshold: number;
  status: StockStatus;
  location: {
    aisle: string;
    shelf: string;
    warehouse: string;      // dari location.warehouse.name
    warehouseId: number;    // dari location.warehouse.id
  } | null;
  supplier: string;         // dari supplier.name
  supplierId: number;       // dari supplier.id
  imageUrl: string | null;  // dari images.find(isPrimary)?.url
  updatedAt: string;        // formatted dari updatedAt
}

// Transform helper: InventoryItemResponse → InventoryItem
export function toInventoryItem(raw: InventoryItemResponse): InventoryItem {
  const primaryImage = raw.images.find((img) => img.isPrimary) ?? raw.images[0];

  return {
    id: raw.id,
    name: raw.name,
    category: raw.category.name,
    subCategory: raw.category.subCategory,
    sku: raw.sku,
    currentStock: raw.currentStock,
    stockThreshold: raw.stockThreshold,
    status: raw.status,
    location: raw.location
      ? {
          aisle: raw.location.aisle,
          shelf: raw.location.shelf,
          warehouse: raw.location.warehouse.name,
          warehouseId: raw.location.warehouse.id,
        }
      : null,
    supplier: raw.supplier.name,
    supplierId: raw.supplier.id,
    imageUrl: primaryImage?.url ?? null,
    updatedAt: new Date(raw.updatedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

// ─────────────────────────────────────────
// TABLE / FILTER STATE
// ─────────────────────────────────────────

export interface InventoryFilter {
  tab: FilterTab;
  category: string | null;
  warehouseId: number | null;   // number, sesuai backend
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
  perPage: number;
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
  width?: string;
}

export interface InventoryTableState {
  items: InventoryItem[];
  selectedIds: Set<number>;     // number, sesuai id dari backend
  filter: InventoryFilter;
  sort: SortState;
  pagination: PaginationState;
  isLoading: boolean;
}

// ─────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────

export interface RowAction {
  id: 'view' | 'edit' | 'reorder';
  label: string;
  icon: string;
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

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
}

// ─────────────────────────────────────────
// ADMIN OVERVIEW
// ─────────────────────────────────────────

export interface OverviewStats {
  totalInventoryValue: number;
  lowStockItems: number;
  recentActivity: ActivityLog[];
  warehouseZones: WarehouseZone[];
}

export interface ActivityLog {
  id: number;
  description: string;
  delta: number | null;
  status: string | null;
  createdAt: string;
  user: { id: number; name: string; avatar: string | null } | null;
  product: { id: number; name: string; sku: string } | null;
}

export interface WarehouseZone {
  id: number;
  name: string;           // e.g. "Zone A (Ceramics)"
  percentage: number;
  warehouse: WarehouseResponse;
}