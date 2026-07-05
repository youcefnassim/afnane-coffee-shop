with open('src/store/useProductStore.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all media_url: "" with media_url: "/logo.jpg"
updated_content = content.replace('media_url: ""', 'media_url: "/logo.jpg"')

with open('src/store/useProductStore.ts', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("Successfully replaced blank media URLs with '/logo.jpg' placeholder!")
