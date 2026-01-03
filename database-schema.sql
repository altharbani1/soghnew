-- ============================================================
-- Souqah Marketplace Database Schema
-- Professional & Comprehensive Design
-- ============================================================

-- Drop existing tables if they exist (for development only)
DROP TABLE IF EXISTS ad_favorites CASCADE;
DROP TABLE IF EXISTS ad_views CASCADE;
DROP TABLE IF EXISTS ad_dynamic_fields CASCADE;
DROP TABLE IF EXISTS ad_images CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS ads CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS user_verifications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- ENUMS
-- ============================================================

-- User verification status
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');

-- Ad status
CREATE TYPE ad_status AS ENUM ('draft', 'active', 'sold', 'expired', 'suspended', 'deleted');

-- Verification badge types
CREATE TYPE badge_type AS ENUM ('identity', 'business', 'trusted', 'premium');

-- Price type
CREATE TYPE price_type AS ENUM ('fixed', 'negotiable', 'contact');

-- ============================================================
-- USERS TABLE
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Profile
    avatar_url TEXT,
    bio TEXT,
    city VARCHAR(100),
    
    -- Verification
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    badges badge_type[] DEFAULT '{}',
    
    -- Stats
    total_ads INTEGER DEFAULT 0,
    active_ads INTEGER DEFAULT 0,
    sold_ads INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_banned BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    -- Indexes
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^05[0-9]{8}$')
);

-- ============================================================
-- USER VERIFICATIONS TABLE
-- ============================================================

CREATE TABLE user_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Verification Details
    badge_type badge_type NOT NULL,
    status verification_status DEFAULT 'pending',
    
    -- Documents
    document_type VARCHAR(50),
    document_number VARCHAR(100),
    document_images TEXT[],
    
    -- Business Info (for business verification)
    business_name VARCHAR(255),
    business_license VARCHAR(100),
    business_address TEXT,
    
    -- Review
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Info
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(10),
    color VARCHAR(7),
    
    -- Display
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Stats
    total_ads INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SUBCATEGORIES TABLE
-- ============================================================

CREATE TABLE subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    
    -- Basic Info
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    
    -- Display
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Stats
    total_ads INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint
    UNIQUE(category_id, slug)
);

-- ============================================================
-- ADS TABLE (Main Table)
-- ============================================================

CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    
    -- Basic Information
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    
    -- Pricing
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    price_type price_type DEFAULT 'fixed',
    currency VARCHAR(3) DEFAULT 'SAR',
    
    -- Location
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    detailed_location TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Contact
    contact_phone VARCHAR(20) NOT NULL,
    contact_whatsapp VARCHAR(20),
    show_phone BOOLEAN DEFAULT TRUE,
    
    -- Status & Visibility
    status ad_status DEFAULT 'active',
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP,
    is_urgent BOOLEAN DEFAULT FALSE,
    
    -- Stats
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    messages_count INTEGER DEFAULT 0,
    
    -- SEO
    slug VARCHAR(255) UNIQUE,
    meta_description TEXT,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT TRUE,
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Timestamps
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    sold_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_contact_phone CHECK (contact_phone ~* '^05[0-9]{8}$')
);

-- ============================================================
-- AD IMAGES TABLE
-- ============================================================

CREATE TABLE ad_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    
    -- Image Info
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    format VARCHAR(10),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure only one primary image per ad
    UNIQUE(ad_id, is_primary) WHERE is_primary = TRUE
);

-- ============================================================
-- AD DYNAMIC FIELDS TABLE
-- For category-specific fields (e.g., car brand, property size)
-- ============================================================

CREATE TABLE ad_dynamic_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    
    -- Field Info
    field_name VARCHAR(100) NOT NULL,
    field_value TEXT NOT NULL,
    field_type VARCHAR(50) DEFAULT 'text', -- text, number, boolean, date, select
    
    -- Display
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint
    UNIQUE(ad_id, field_name)
);

-- ============================================================
-- AD VIEWS TABLE
-- Track who viewed which ads
-- ============================================================

CREATE TABLE ad_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Tracking
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Index for analytics
    UNIQUE(ad_id, user_id, DATE(viewed_at))
);

-- ============================================================
-- AD FAVORITES TABLE
-- Users can favorite/bookmark ads
-- ============================================================

CREATE TABLE ad_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint
    UNIQUE(ad_id, user_id)
);

-- ============================================================
-- MESSAGES TABLE
-- User-to-user messaging about ads
-- ============================================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message Content
    message TEXT NOT NULL,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure users can't message themselves
    CONSTRAINT different_users CHECK (sender_id != receiver_id)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- Users Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

-- User Verifications Indexes
CREATE INDEX idx_verifications_user_id ON user_verifications(user_id);
CREATE INDEX idx_verifications_status ON user_verifications(status);
CREATE INDEX idx_verifications_badge_type ON user_verifications(badge_type);

-- Categories Indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_categories_order ON categories(display_order);

-- Subcategories Indexes
CREATE INDEX idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX idx_subcategories_slug ON subcategories(slug);
CREATE INDEX idx_subcategories_active ON subcategories(is_active) WHERE is_active = TRUE;

-- Ads Indexes (Critical for Performance)
CREATE INDEX idx_ads_user_id ON ads(user_id);
CREATE INDEX idx_ads_category_id ON ads(category_id);
CREATE INDEX idx_ads_subcategory_id ON ads(subcategory_id);
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_city ON ads(city);
CREATE INDEX idx_ads_price ON ads(price);
CREATE INDEX idx_ads_created_at ON ads(created_at DESC);
CREATE INDEX idx_ads_published_at ON ads(published_at DESC);
CREATE INDEX idx_ads_slug ON ads(slug);
CREATE INDEX idx_ads_featured ON ads(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_ads_active ON ads(status) WHERE status = 'active';

-- Composite indexes for common queries
CREATE INDEX idx_ads_category_status_created ON ads(category_id, status, created_at DESC);
CREATE INDEX idx_ads_city_status_created ON ads(city, status, created_at DESC);
CREATE INDEX idx_ads_user_status ON ads(user_id, status);

-- Full-text search index for ads
CREATE INDEX idx_ads_search ON ads USING GIN(to_tsvector('arabic', title || ' ' || description));

-- Ad Images Indexes
CREATE INDEX idx_ad_images_ad_id ON ad_images(ad_id);
CREATE INDEX idx_ad_images_primary ON ad_images(ad_id, is_primary) WHERE is_primary = TRUE;

-- Ad Dynamic Fields Indexes
CREATE INDEX idx_dynamic_fields_ad_id ON ad_dynamic_fields(ad_id);
CREATE INDEX idx_dynamic_fields_name ON ad_dynamic_fields(field_name);

-- Ad Views Indexes
CREATE INDEX idx_ad_views_ad_id ON ad_views(ad_id);
CREATE INDEX idx_ad_views_user_id ON ad_views(user_id);
CREATE INDEX idx_ad_views_date ON ad_views(viewed_at DESC);

-- Ad Favorites Indexes
CREATE INDEX idx_favorites_ad_id ON ad_favorites(ad_id);
CREATE INDEX idx_favorites_user_id ON ad_favorites(user_id);

-- Messages Indexes
CREATE INDEX idx_messages_ad_id ON messages(ad_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read) WHERE is_read = FALSE;

-- ============================================================
-- TRIGGERS FOR AUTO-UPDATE
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON subcategories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON ads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON user_verifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TRIGGERS FOR STATS UPDATE
-- ============================================================

-- Update user stats when ad is created/updated/deleted
CREATE OR REPLACE FUNCTION update_user_ad_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users SET 
            total_ads = total_ads + 1,
            active_ads = active_ads + CASE WHEN NEW.status = 'active' THEN 1 ELSE 0 END
        WHERE id = NEW.user_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != NEW.status THEN
            UPDATE users SET
                active_ads = active_ads + 
                    CASE WHEN NEW.status = 'active' THEN 1 ELSE 0 END -
                    CASE WHEN OLD.status = 'active' THEN 1 ELSE 0 END,
                sold_ads = sold_ads + 
                    CASE WHEN NEW.status = 'sold' THEN 1 ELSE 0 END -
                    CASE WHEN OLD.status = 'sold' THEN 1 ELSE 0 END
            WHERE id = NEW.user_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users SET 
            total_ads = total_ads - 1,
            active_ads = active_ads - CASE WHEN OLD.status = 'active' THEN 1 ELSE 0 END
        WHERE id = OLD.user_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_ad_stats
AFTER INSERT OR UPDATE OR DELETE ON ads
FOR EACH ROW EXECUTE FUNCTION update_user_ad_stats();

-- Update category stats
CREATE OR REPLACE FUNCTION update_category_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE categories SET total_ads = total_ads + 1 WHERE id = NEW.category_id;
        IF NEW.subcategory_id IS NOT NULL THEN
            UPDATE subcategories SET total_ads = total_ads + 1 WHERE id = NEW.subcategory_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.category_id != NEW.category_id THEN
            UPDATE categories SET total_ads = total_ads - 1 WHERE id = OLD.category_id;
            UPDATE categories SET total_ads = total_ads + 1 WHERE id = NEW.category_id;
        END IF;
        IF OLD.subcategory_id != NEW.subcategory_id THEN
            IF OLD.subcategory_id IS NOT NULL THEN
                UPDATE subcategories SET total_ads = total_ads - 1 WHERE id = OLD.subcategory_id;
            END IF;
            IF NEW.subcategory_id IS NOT NULL THEN
                UPDATE subcategories SET total_ads = total_ads + 1 WHERE id = NEW.subcategory_id;
            END IF;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories SET total_ads = total_ads - 1 WHERE id = OLD.category_id;
        IF OLD.subcategory_id IS NOT NULL THEN
            UPDATE subcategories SET total_ads = total_ads - 1 WHERE id = OLD.subcategory_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_category_stats
AFTER INSERT OR UPDATE OR DELETE ON ads
FOR EACH ROW EXECUTE FUNCTION update_category_stats();

-- Update ad favorites count
CREATE OR REPLACE FUNCTION update_ad_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE ads SET favorites_count = favorites_count + 1 WHERE id = NEW.ad_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE ads SET favorites_count = favorites_count - 1 WHERE id = OLD.ad_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_favorites_count
AFTER INSERT OR DELETE ON ad_favorites
FOR EACH ROW EXECUTE FUNCTION update_ad_favorites_count();

-- ============================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================

-- Active ads with full details
CREATE OR REPLACE VIEW active_ads_view AS
SELECT 
    a.*,
    u.name as user_name,
    u.phone as user_phone,
    u.avatar_url as user_avatar,
    u.rating as user_rating,
    u.badges as user_badges,
    c.name as category_name,
    c.slug as category_slug,
    c.icon as category_icon,
    s.name as subcategory_name,
    s.slug as subcategory_slug,
    (SELECT image_url FROM ad_images WHERE ad_id = a.id AND is_primary = TRUE LIMIT 1) as primary_image,
    (SELECT array_agg(image_url ORDER BY display_order) FROM ad_images WHERE ad_id = a.id) as all_images
FROM ads a
JOIN users u ON a.user_id = u.id
JOIN categories c ON a.category_id = c.id
LEFT JOIN subcategories s ON a.subcategory_id = s.id
WHERE a.status = 'active' AND a.deleted_at IS NULL;

-- ============================================================
-- SAMPLE DATA INSERTION
-- ============================================================

-- Insert sample categories
INSERT INTO categories (name, slug, icon, color, display_order) VALUES
('سيارات', 'cars', '🚗', '#ef4444', 1),
('عقارات', 'realestate', '🏠', '#22c55e', 2),
('الكترونيات', 'electronics', '📱', '#3b82f6', 3),
('أثاث ومفروشات', 'furniture', '🛋️', '#f59e0b', 4),
('أزياء وموضة', 'fashion', '👔', '#ec4899', 5),
('وظائف', 'jobs', '💼', '#8b5cf6', 6),
('خدمات', 'services', '🔧', '#06b6d4', 7),
('حيوانات', 'animals', '🐾', '#84cc16', 8);

-- ============================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================

COMMENT ON TABLE users IS 'User accounts with profile and verification info';
COMMENT ON TABLE ads IS 'Main ads table with all listing information';
COMMENT ON TABLE categories IS 'Top-level categories for organizing ads';
COMMENT ON TABLE subcategories IS 'Subcategories under main categories';
COMMENT ON TABLE ad_images IS 'Images associated with ads';
COMMENT ON TABLE ad_dynamic_fields IS 'Category-specific custom fields for ads';
COMMENT ON TABLE ad_views IS 'Track ad views for analytics';
COMMENT ON TABLE ad_favorites IS 'User favorites/bookmarks';
COMMENT ON TABLE messages IS 'User-to-user messaging about ads';

-- ============================================================
-- END OF SCHEMA
-- ============================================================
