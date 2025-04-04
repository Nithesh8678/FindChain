# Firebase Setup Guide

## Deploying Security Rules

### Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Logged in to Firebase (`firebase login`)
- Initialized Firebase in your project (`firebase init`)

### Deploying Firestore Rules

1. Make sure your `firestore.rules` file is in the root of your project
2. Run the following command:
   ```
   firebase deploy --only firestore:rules
   ```

### Deploying Storage Rules

1. Make sure your `storage.rules` file is in the root of your project
2. Run the following command:
   ```
   firebase deploy --only storage
   ```

## Security Rules Explanation

### Firestore Rules

- **Read Access**: Anyone can read items in the `items` collection
- **Create Access**: Anyone can create new items
- **Update/Delete Access**: Only the item owner can update or delete their items
- **Default Rule**: All other access is denied by default

### Storage Rules

- **Read Access**: Anyone can read files
- **Write Access**: Anyone can upload files
- **Note**: These rules are permissive for development. For production, you should restrict access based on authentication.

## Production Security Recommendations

For a production environment, consider these additional security measures:

1. **Authentication**: Implement user authentication and restrict access based on user roles
2. **Data Validation**: Add validation rules to ensure data integrity
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Field-Level Security**: Restrict access to specific fields based on user roles
5. **Audit Logging**: Enable audit logging to track access and changes

## Environment Variables

Make sure your `.env` file contains all the necessary Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

And Cloudinary configuration:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```
