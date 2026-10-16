-- Khóa truy cập Data API (PostgREST) của Supabase cho schema public.
--
-- Bối cảnh: app chỉ truy cập DB qua Prisma (role `postgres`, bỏ qua RLS) và
-- Storage qua service role key. Không có client nào dùng anon/authenticated key
-- để đọc bảng, nên bật RLS mà KHÔNG tạo policy = chặn hoàn toàn truy cập qua API
-- mà không ảnh hưởng app.
--
-- Chạy trong Supabase Dashboard > SQL Editor. Có thể chạy lại nhiều lần (idempotent).
-- Đặt ở prisma/sql/ (không phải prisma/migrations/) để `prisma migrate` không tự chạy.

BEGIN;

-- 1. Bật RLS cho mọi bảng hiện có trong public (sửa cảnh báo rls_disabled_in_public).
DO $$
DECLARE
  t record;
BEGIN
  FOR t IN
    SELECT schemaname, tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', t.schemaname, t.tablename);
  END LOOP;
END $$;

-- 2. Thu hồi quyền của role API trên bảng/sequence/function hiện có
--    (sửa cảnh báo sensitive_columns_exposed).
REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;

-- 3. Đối tượng tạo sau này (ví dụ qua `prisma migrate`) cũng không tự cấp quyền cho API.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES    FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

COMMIT;

-- Kiểm tra: tất cả bảng phải có rowsecurity = true, và không còn grant cho anon/authenticated.
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND grantee IN ('anon', 'authenticated');

-- Lưu ý: bảng mới tạo sau này qua Prisma sẽ chưa bật RLS. Chạy lại bước 1 sau mỗi
-- lần migrate thêm bảng (hoặc thêm `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` vào migration đó).
