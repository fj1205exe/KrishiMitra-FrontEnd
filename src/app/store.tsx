import { createContext, useContext, useState, ReactNode, useCallback } from "react";

// ─── Shared app store ─────────────────────────────────────────────────────────

export type CartItem = {
  id: number;
  name: string;
  brand: string;
  price: number;
  crop: string;
  qty: number;
};

export type Order = {
  id: string;
  date: number;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  status: "confirmed" | "packed" | "shipped" | "delivered";
};

// guidanceProgress: { [cropKey]: { [articleId]: true } }
type GuidanceProgress = Record<string, Record<string, boolean>>;

type StoreCtx = {
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: Omit<CartItem, "qty">) => void;
  setQty: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  // Wishlist
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  // Orders
  orders: Order[];
  placeOrder: (o: Omit<Order, "id" | "date" | "status">) => Order;
  // Currently selected crop (for the per-crop detail page)
  selectedCrop: string;
  setSelectedCrop: (c: string) => void;
  // Crop Guidance — progress tracking
  guidanceProgress: GuidanceProgress;
  markGuidanceComplete: (cropKey: string, articleId: string) => void;
  // Crop Guidance — bookmarks
  guidanceBookmarks: string[]; // article IDs
  toggleGuidanceBookmark: (articleId: string) => void;
  // Crop Guidance — recently viewed
  recentlyViewed: string[]; // article IDs
  addRecentlyViewed: (articleId: string) => void;
};

const Ctx = createContext<StoreCtx>({} as StoreCtx);

const CART_KEY = "krishimitra.cart";
const ORDERS_KEY = "krishimitra.orders";
const WISH_KEY = "krishimitra.wishlist";
const GUIDE_PROGRESS_KEY = "krishimitra.guide_progress";
const GUIDE_BOOKMARKS_KEY = "krishimitra.guide_bookmarks";
const GUIDE_RECENT_KEY = "krishimitra.guide_recent";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* unavailable */ }
  return fallback;
}
function save(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* unavailable */ }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => load(CART_KEY, []));
  const [orders, setOrders] = useState<Order[]>(() => load(ORDERS_KEY, []));
  const [wishlist, setWishlist] = useState<number[]>(() => load(WISH_KEY, []));
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [guidanceProgress, setGuidanceProgress] = useState<GuidanceProgress>(() => load(GUIDE_PROGRESS_KEY, {}));
  const [guidanceBookmarks, setGuidanceBookmarks] = useState<string[]>(() => load(GUIDE_BOOKMARKS_KEY, []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => load(GUIDE_RECENT_KEY, []));

  const commitCart = useCallback((next: CartItem[]) => { setCart(next); save(CART_KEY, next); }, []);


  const addToCart = useCallback((item: Omit<CartItem, "qty">) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      const next = existing
        ? prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
        : [...prev, { ...item, qty: 1 }];
      save(CART_KEY, next);
      return next;
    });
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setCart((prev) => {
      const next = qty <= 0 ? prev.filter((c) => c.id !== id) : prev.map((c) => (c.id === id ? { ...c, qty } : c));
      save(CART_KEY, next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => { const next = prev.filter((c) => c.id !== id); save(CART_KEY, next); return next; });
  }, []);

  const clearCart = useCallback(() => commitCart([]), [commitCart]);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist((prev) => { const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]; save(WISH_KEY, next); return next; });
  }, []);

  const placeOrder = useCallback((o: Omit<Order, "id" | "date" | "status">) => {
    const order: Order = { ...o, id: "KM" + Date.now().toString().slice(-8), date: Date.now(), status: "confirmed" };
    setOrders((prev) => { const next = [order, ...prev]; save(ORDERS_KEY, next); return next; });
    commitCart([]);
    return order;
  }, [commitCart]);

  const markGuidanceComplete = useCallback((cropKey: string, articleId: string) => {
    setGuidanceProgress(prev => {
      const next = { ...prev, [cropKey]: { ...(prev[cropKey] ?? {}), [articleId]: true } };
      save(GUIDE_PROGRESS_KEY, next);
      return next;
    });
  }, []);

  const toggleGuidanceBookmark = useCallback((articleId: string) => {
    setGuidanceBookmarks(prev => {
      const next = prev.includes(articleId) ? prev.filter(x => x !== articleId) : [...prev, articleId];
      save(GUIDE_BOOKMARKS_KEY, next);
      return next;
    });
  }, []);

  const addRecentlyViewed = useCallback((articleId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(x => x !== articleId);
      const next = [articleId, ...filtered].slice(0, 50);
      save(GUIDE_RECENT_KEY, next);
      return next;
    });
  }, []);

  const cartCount = cart.reduce((n, c) => n + c.qty, 0);
  const cartTotal = cart.reduce((n, c) => n + c.qty * c.price, 0);

  return (
    <Ctx.Provider value={{
      cart, cartCount, cartTotal, addToCart, setQty, removeFromCart, clearCart,
      wishlist, toggleWishlist, orders, placeOrder, selectedCrop, setSelectedCrop,
      guidanceProgress, markGuidanceComplete,
      guidanceBookmarks, toggleGuidanceBookmark,
      recentlyViewed, addRecentlyViewed,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useStore = () => useContext(Ctx);
