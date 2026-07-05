import re

file_path = 'src/store/useProductStore.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all media_url values that start with http to empty strings
# Example: media_url: "https://..." -> media_url: ""
# We will match: media_url: "https://[^"]*"
cleaned_content = re.sub(r'media_url:\s*"https://[^"]*"', 'media_url: ""', content)

# Also let's set media_url to "" for `/Video.mp4` if they want to fill it themselves
cleaned_content = re.sub(r'media_url:\s*"/Video.mp4"', 'media_url: ""', cleaned_content)

# We should also ensure media_type is set to "image" if media_url is cleared
# (except if we want to let them choose)
cleaned_content = re.sub(r'media_type:\s*"video"', 'media_type: "image"', cleaned_content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(cleaned_content)

print("Successfully cleared all product images from useProductStore.ts fallback!")
