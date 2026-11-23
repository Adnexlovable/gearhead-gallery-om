-- Public buckets serve direct object URLs without allowing bucket-wide enumeration.
DROP POLICY IF EXISTS gearhead_product_images_public_read ON storage.objects;
