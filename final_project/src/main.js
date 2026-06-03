import { World } from './World/World.js';


async function main() {
  // Get a reference to the container element
  const container = document.querySelector('#scene-container');

  const world = new World(container);

  await world.init();

  world.start();
}

main().catch((err => {
  console.error(err);
}));
