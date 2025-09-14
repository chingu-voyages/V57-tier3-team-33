import dotenv from "dotenv";

dotenv.config();

const required = (name) => {
    const value = process.env[name];

    if (!value) throw new Error(`Missing environment variable: ${name}`);

    return value;
}

export const PORT=required('PORT');
export const TYPE=required('TYPE');
export const PROJECT_ID=required('PROJECT_ID');
export const PRIVATE_KEY_ID=required('PRIVATE_KEY_ID');
export const PRIVATE_KEY=required('PRIVATE_KEY');
export const CLIENT_EMAIL=required('CLIENT_EMAIL');
export const CLIENT_ID=required('CLIENT_ID');
export const AUTH_URI=required('AUTH_URI');
export const TOKEN_URI=required('TOKEN_URI');
export const AUTH_PROVIDER_X509_CERT_URL=required('AUTH_PROVIDER_X509_CERT_URL');
export const CLIENT_X509_CERT_URL=required('CLIENT_X509_CERT_URL');
export const UNIVERSE_DOMAIN=required('UNIVERSE_DOMAIN');