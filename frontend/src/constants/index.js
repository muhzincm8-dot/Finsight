/** Navigation items for the main app sidebar */
export const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
  { label: "Transactions", path: "/transactions", icon: "ArrowLeftRight" },
  { label: "Insights", path: "/insights", icon: "PieChart" },
];

/** Sidebar bottom navigation items */
export const SIDEBAR_BOTTOM_ITEMS = [
  { label: "Settings", path: "/profile", icon: "Settings" },
];

/** Default monthly budget goal */
export const DEFAULT_BUDGET_GOAL = 2000;

/** Chart color palette shared across pie/bar charts */
export const CHART_COLORS = [
  "#10b981",
  "#3b82f6",
  "#a855f7",
  "#f59e0b",
];

/** Expense category options */
export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
  "Education",
  "Tech",
];

/** Income category options */
export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Gift",
  "Other",
];

/** Keyword-to-category auto-detection mappings */
export const KEYWORD_MAPPINGS = {
  expense: {
    Food: ["starbucks", "mcdonalds", "burger", "pizza", "coffee", "lunch", "dinner", "groceries", "restaurant", "cafe"],
    Transport: ["uber", "lyft", "taxi", "bus", "train", "flight", "petrol", "gas", "fuel", "parking"],
    Housing: ["rent", "mortgage", "repair", "furniture"],
    Utilities: ["electric", "water", "internet", "wifi", "phone", "mobile", "bill"],
    Entertainment: ["netflix", "spotify", "hulu", "cinema", "movie", "game", "steam", "concert"],
    Health: ["doctor", "pharmacy", "gym", "medicine", "clinic"],
    Shopping: ["amazon", "ebay", "walmart", "target", "clothes", "shoes"],
    Education: ["course", "book", "tuition", "school", "university"],
    Tech: ["software", "hardware", "apple", "google", "microsoft", "subscription"],
  },
  income: {
    Salary: ["salary", "wages", "paycheck", "bonus"],
    Freelance: ["project", "client", "upwork", "fiverr", "freelance"],
    Investments: ["dividend", "interest", "stock", "crypto", "return"],
    Gift: ["gift", "birthday", "present"],
    Other: ["refund", "cashback"],
  },
};

/** Premium feature list for upgrade page */
export const PREMIUM_FEATURES = [
  { icon: "TrendingUp", text: "Unlimited transaction history" },
  { icon: "BarChart2", text: "Advanced financial insights & charts" },
  { icon: "Download", text: "Export data to CSV anytime" },
  { icon: "Shield", text: "Priority support & account protection" },
  { icon: "Clock", text: "Lifetime access — one-time payment" },
  { icon: "Sparkles", text: "All future premium features included" },
];

/** Admin panel filter tabs */
export const ADMIN_FILTER_OPTIONS = ["all", "active", "suspended", "premium", "admin"];

/** Transaction filter categories for the Transactions page */
export const TRANSACTION_FILTER_CATEGORIES = [
  "All",
  "Income",
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
  "Education",
  "Tech",
  "Salary",
  "Freelance",
  "Investments",
  "Gift",
  "Other",
];
