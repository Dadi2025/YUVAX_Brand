# Environment Variables

## Server (.env)

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/yuvax

# Security - IMPORTANT: Generate a strong secret for production
# Generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# Optional
BCRYPT_ROUNDS=10
```

### Generating a Secure JWT Secret

Run this command to generate a secure random secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

## Client (.env)

Create a `.env` file in the `client` directory (optional):

```env
VITE_API_URL=http://localhost:5000
```

## Important Notes

- **Never commit `.env` files to version control**
- The `.env.example` files are templates - copy them to `.env` and fill in your actual values
- For production, use strong, randomly generated secrets
- Update `CLIENT_URL` to your production domain when deploying
