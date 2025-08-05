# Supabase Storage Setup for Image Uploads

## 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Set the following:
   - **Name**: `listings`
   - **Public bucket**: ✅ Check this (so images can be accessed publicly)
   - **File size limit**: `5MB` (or your preferred limit)
   - **Allowed MIME types**: `image/*` (allows all image types)

## 2. Set Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies:

### Policy 1: Allow anyone to view images
```sql
CREATE POLICY "Anyone can view listing images" ON storage.objects
FOR SELECT USING (bucket_id = 'listings');
```

### Policy 2: Allow authenticated users to upload images
```sql
CREATE POLICY "Authenticated users can upload listing images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'listings' 
  AND auth.role() = 'authenticated'
);
```

### Policy 3: Allow users to update their own images
```sql
CREATE POLICY "Users can update their own listing images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'listings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 4: Allow users to delete their own images
```sql
CREATE POLICY "Users can delete their own listing images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'listings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 3. Test the Setup

1. Try uploading an image through the form
2. Check if the image appears in the Storage section
3. Verify the image URL is accessible publicly

## 4. Troubleshooting

If images don't upload:
1. Check browser console for errors
2. Verify bucket name is exactly `listings`
3. Ensure policies are correctly applied
4. Check if user is authenticated when uploading

If images don't display:
1. Verify the bucket is public
2. Check if the image URL is correct
3. Ensure the image file exists in the bucket 