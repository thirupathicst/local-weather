import app from './app.js';
import logger from './utils/logger.js';

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}