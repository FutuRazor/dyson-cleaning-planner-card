import { copyFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const configDir = process.env.HA_CONFIG_DIR;
if (!configDir) {
  console.log('Deployment skipped: HA_CONFIG_DIR is not configured.');
} else {
  const destinationDir = join(configDir, 'www', 'dyson-planner');
  const destinationAvailable = await stat(destinationDir).then(info => info.isDirectory(), () => false);
  if (!destinationAvailable) {
    console.log(`Deployment skipped: ${destinationDir} is not available.`);
  } else {
    const source = new URL('../dist/dyson-cleaning-planner-card.js', import.meta.url);
    const destination = join(destinationDir, 'dyson-cleaning-planner-card.js');
    await copyFile(source, destination);
    console.log(`Deployed to ${destination}`);
  }
}
