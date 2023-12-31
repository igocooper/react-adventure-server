import type { Weapon } from '../types';

export const spikeMace: Weapon = {
  name: 'Spike Mace',
  imageSrc: '/images/weapons/maces/spike-mace.png',
  stats: {
    damage: '5-20'
  }
};

export const rustyMace: Weapon = {
  name: 'Rusty Mace',
  imageSrc: '/images/weapons/maces/rusty-mace.png',
  stats: {
    damage: '5-7'
  }
};

export const maces = [
  spikeMace,
  rustyMace,
]