-- supabase_schema.sql
-- Superales Melaware and Japan Surplus - Database Schema

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  phone text,
  address text,
  created_at timestamp with time zone default now()
);

-- Products table
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  category text check (category in ('kitchen','tableware','home')),
  image_url text,
  emoji text default '🛍',
  stock integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Insert the 7 default products
insert into products (name, description, price, category, emoji, stock) values
('Pans', 'High-quality Japanese cookware with excellent heat distribution and durability. Perfect for everyday cooking and professional use.', 299, 'kitchen', '🍳', 50),
('Plates', 'Elegant ceramic plates with traditional Japanese design. Ideal for dining and special occasions — beautiful yet functional.', 149, 'tableware', '🍽️', 80),
('Towels', 'Premium soft towels made with authentic Japanese cotton. Highly absorbent and long-lasting — luxury feel at every use.', 199, 'home', '🛁', 60),
('Mugs', 'Beautiful ceramic mugs perfect for coffee and tea. Each piece reflects Japanese artistry and warmth.', 129, 'tableware', '☕', 70),
('Tea Sets', 'Traditional Japanese tea sets for authentic tea ceremonies. Complete and ready to use — bring Japan to your table.', 599, 'tableware', '🍵', 30),
('Cups & Saucers', 'Delicate porcelain cups paired with matching saucers. Perfect for tea or coffee service — elegantly crafted.', 249, 'tableware', '🫗', 45),
('Clay Pots', 'Authentic clay pots used in traditional Japanese cooking. Excellent for brewing and serving soups, teas, and stews.', 349, 'kitchen', '🪴', 25);

-- Orders table
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  customer_name text not null,
  phone text not null,
  address text not null,
  city text,
  barangay text,
  payment_method text check (payment_method in ('cod','gcash')),
  gcash_receipt_url text,
  status text default 'pending'
    check (status in ('pending','payment_verified','processing','shipped','delivered')),
  total_amount numeric(10,2) not null,
  notes text,
  created_at timestamp with time zone default now()
);

-- Order items table
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders on delete cascade,
  product_id uuid references products,
  product_name text,
  quantity integer not null,
  unit_price numeric(10,2) not null
);

-- RLS Policies
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Profiles: users can only read/update their own
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Products: anyone can read active products
create policy "Anyone can view active products" on products for select using (is_active = true);

-- Orders: users can insert and view their own orders
create policy "Users can insert orders" on orders for insert with check (auth.uid() = user_id);
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);

-- Order items: users can insert and view their own
create policy "Users can insert order items" on order_items for insert with check (true);
create policy "Users can view order items" on order_items for select using (true);

-- Auto-create profile on signup (Supabase function)
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, address)
  values (new.id, new.raw_user_meta_data->>'full_name',
          new.raw_user_meta_data->>'phone',
          new.raw_user_meta_data->>'address');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
