import { put } from '@vercel/blob';

const blobOptions = {
  token: process.env.BLOB_READ_WRITE_TOKEN, // Certifique-se de que este token está definido em seu arquivo .env
};

export { put, blobOptions };
