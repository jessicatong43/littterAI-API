import fs from 'fs/promises';
import { logError } from '../../../src/Errors/logError';

jest.mock('fs/promises', () => ({
  appendFile: jest.fn(),
}));

describe('logError Function', () => {
  it('should successfully write to the log file', async () => {
    const error = new Error('Some error');
    const context = 'Some context';

    await logError(error, context);

    expect(fs.appendFile).toHaveBeenCalled();
  });

  it('should handle failure when writing to the log file', async () => {
    const error = new Error('Some error');
    const context = 'Some context';

    (fs.appendFile as jest.Mock).mockRejectedValue(
      new Error('File write error')
    );

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await logError(error, context);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to write to log file:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
