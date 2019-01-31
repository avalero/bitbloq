import {colors} from '@bitbloq/ui';

export const documentTypes = {
  'bloqs': {
    label: 'Robótica por bloques',
    shortLabel: 'Robótica',
    color: colors.green,
    supported: false
  },
  '3d': {
    label: 'Diseño 3D',
    shortLabel: 'Diseño 3D',
    color: colors.brandBlue,
    supported: true
  },
  'code': {
    label: 'Robótica por código',
    shortLabel: 'Código',
    color: colors.brandPink,
    supported: false
  },
  'events': {
    label: 'Robótica por eventos',
    shortLabel: 'Eventos',
    color: colors.brandOrange,
    supported: false
  },
  'apps': {
    label: 'Diseño y programación de Apps',
    shortLabel: 'Apps móviles',
    color: colors.brandYellow,
    supported: false
  }
};

