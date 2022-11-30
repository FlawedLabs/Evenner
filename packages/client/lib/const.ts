const API_URL =
    process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : '';

export { API_URL };
