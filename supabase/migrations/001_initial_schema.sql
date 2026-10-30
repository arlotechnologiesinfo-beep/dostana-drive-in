-- DOSTANA DRIVE IN Database Schema
-- Multi-Vendor Food Court Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Food Courts table
CREATE TABLE food_courts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tagline TEXT,
  slug TEXT UNIQUE NOT NULL,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tables table
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  food_court_id UUID REFERENCES food_courts(id) ON DELETE CASCADE,
  table_number INTEGER NOT NULL,
  qr_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'OCCUPIED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(food_court_id, table_number)
);

-- Stalls table
CREATE TABLE stalls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  food_court_id UUID REFERENCES food_courts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Categories table
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stall_id UUID REFERENCES stalls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stall_id UUID REFERENCES stalls(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image TEXT,
  is_available BOOLEAN DEFAULT true,
  is_veg BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table (master order)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  food_court_id UUID REFERENCES food_courts(id),
  table_id UUID REFERENCES tables(id),
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'ORDER_RECEIVED' CHECK (status IN (
    'ORDER_RECEIVED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'
  )),
  payment_method TEXT CHECK (payment_method IN ('UPI', 'CASH_AT_TABLE')),
  payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
  total_amount INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  stall_id UUID REFERENCES stalls(id),
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL,
  total INTEGER NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stall Orders table (split orders per stall)
CREATE TABLE stall_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  stall_id UUID REFERENCES stalls(id),
  status TEXT DEFAULT 'ORDER_RECEIVED' CHECK (status IN (
    'ORDER_RECEIVED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'
  )),
  total_amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount INTEGER NOT NULL,
  method TEXT CHECK (method IN ('UPI', 'CASH_AT_TABLE')),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CAPTURED', 'FAILED', 'REFUNDED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('PERCENTAGE', 'FLAT')),
  discount_value INTEGER NOT NULL,
  min_order INTEGER DEFAULT 0,
  max_discount INTEGER,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Coupons table
CREATE TABLE customer_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  coupon_id UUID REFERENCES coupons(id),
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loyalty Rewards table
CREATE TABLE loyalty_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  points_required INTEGER NOT NULL,
  reward_name TEXT NOT NULL,
  reward_description TEXT,
  discount_amount INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  customer_id UUID REFERENCES customers(id),
  stall_id UUID REFERENCES stalls(id),
  food_rating INTEGER CHECK (food_rating >= 1 AND food_rating <= 5),
  service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
  experience_rating INTEGER CHECK (experience_rating >= 1 AND experience_rating <= 5),
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  type TEXT CHECK (type IN ('ORDER_PLACED', 'ORDER_READY', 'ORDER_DELIVERED', 'PAYMENT_SUCCESS')),
  channel TEXT CHECK (channel IN ('WHATSAPP', 'SMS', 'EMAIL')),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'FAILED')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (admin and stall owners)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('ADMIN', 'STALL_OWNER')),
  stall_id UUID REFERENCES stalls(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics table (pre-computed)
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  stall_id UUID REFERENCES stalls(id),
  total_orders INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0,
  avg_order_value INTEGER DEFAULT 0,
  peak_hour INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, stall_id)
);

-- Indexes
CREATE INDEX idx_tables_food_court ON tables(food_court_id);
CREATE INDEX idx_stalls_food_court ON stalls(food_court_id);
CREATE INDEX idx_menu_categories_stall ON menu_categories(stall_id);
CREATE INDEX idx_menu_items_stall ON menu_items(stall_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_stall ON order_items(stall_id);
CREATE INDEX idx_stall_orders_order ON stall_orders(order_id);
CREATE INDEX idx_stall_orders_stall ON stall_orders(stall_id);
CREATE INDEX idx_stall_orders_status ON stall_orders(status);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_reviews_order ON reviews(order_id);
CREATE INDEX idx_reviews_stall ON reviews(stall_id);
CREATE INDEX idx_notifications_order ON notifications(order_id);
CREATE INDEX idx_analytics_date ON analytics(date DESC);
CREATE INDEX idx_analytics_stall ON analytics(stall_id);

-- Row Level Security (RLS)
ALTER TABLE food_courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stall_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Public read policies for customer-facing data
CREATE POLICY "Public can view active stalls" ON stalls
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view menu categories" ON menu_categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view available menu items" ON menu_items
  FOR SELECT USING (is_available = true);

CREATE POLICY "Public can view tables" ON tables
  FOR SELECT USING (true);

-- Customer policies
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customers can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can view own reviews" ON reviews
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customers can create reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Insert default food court
INSERT INTO food_courts (name, tagline, slug) VALUES
  ('DOSTANA DRIVE IN', 'Where Every Craving Finds Its Place.', 'dostana-drive-in');

-- Insert 25 tables
INSERT INTO tables (food_court_id, table_number, qr_code)
SELECT
  (SELECT id FROM food_courts WHERE slug = 'dostana-drive-in'),
  generate_series(1, 25),
  'table-' || LPAD(generate_series(1, 25)::TEXT, 2, '0');

-- Insert stalls
DO $$
DECLARE
  fc_id UUID;
BEGIN
  SELECT id INTO fc_id FROM food_courts WHERE slug = 'dostana-drive-in';

  INSERT INTO stalls (food_court_id, name, description, is_active, is_popular, sort_order) VALUES
    (fc_id, 'Nani''s Tiffins', 'Authentic South Indian tiffins made with love', true, true, 1),
    (fc_id, 'Tea Time', 'Your daily dose of warmth and chill', true, false, 2),
    (fc_id, 'Juice Corner', 'Freshly squeezed, blended, and served', true, true, 3),
    (fc_id, 'Talks & Tonic', 'The chatpata corner where every bite tells a story', true, false, 4),
    (fc_id, 'Dilli''s D''Lite', 'Authentic Delhi ki flavor - a royal feast awaits', true, true, 5),
    (fc_id, 'Aroma Biryani & Pulao', 'Every grain of rice tells a story of passion', true, true, 6),
    (fc_id, 'Cool Point', 'Life is short, eat dessert first', true, false, 7);
END $$;

-- Insert sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order, valid_from, valid_until) VALUES
  ('WELCOME50', 'Welcome discount - 50% off', 'PERCENTAGE', 50, 100, NOW(), NOW() + INTERVAL '30 days'),
  ('FIRSTORDER', 'First order flat ₹100 off', 'FLAT', 100, 200, NOW(), NOW() + INTERVAL '30 days'),
  ('DOSTANA10', '10% off on all orders', 'PERCENTAGE', 10, 50, NOW(), NOW() + INTERVAL '60 days'),
  ('WEEKEND20', 'Weekend special - 20% off', 'PERCENTAGE', 20, 150, NOW(), NOW() + INTERVAL '90 days');

-- Insert loyalty rewards
INSERT INTO loyalty_rewards (points_required, reward_name, reward_description, discount_amount) VALUES
  (100, 'Bronze Reward', '₹50 off on next order', 50),
  (250, 'Silver Reward', '₹125 off on next order', 125),
  (500, 'Gold Reward', '₹300 off on next order', 300),
  (1000, 'Platinum Reward', '₹700 off on next order', 700);
