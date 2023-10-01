import fs from 'fs/promises';
import path from 'path';

export const logError = async (error: Error, context?: string) => {
  const logMessage = `[${new Date().toISOString()}] - ERROR: ${
    context || 'No context provided'
  } - ${error.message || 'Unknown error'} - Stack: ${error.stack || 'N/A'}\n`;

  const logFilePath = getLogFilePath();

  try {
    await fs.appendFile(logFilePath, logMessage);
  } catch (fileError) {
    console.error('Failed to write to log file:', fileError);
  }
};

const getLogFilePath = () => path.join(__dirname, 'error.log');
