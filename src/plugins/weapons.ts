import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Joi from 'joi';

const plugin: Hapi.Plugin<undefined> = {
  name: 'app/weapons',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: 'GET',
        path: '/weapons',
        handler: getWeaponsHandler,
        options: {
          auth: false
        }
      },
      {
        method: 'POST',
        path: '/weapons',
        handler: getWeaponsByIdsHandler,
        options: {
          auth: false,
          validate: {
            payload: Joi.object({
              ids: Joi.array().items(Joi.number().integer())
            }),
            failAction: (request, h, err) => {
              // show validation errors to user https://github.com/hapijs/hapi/issues/3706
              throw err;
            }
          }
        }
      },
      {
        method: 'GET',
        path: '/weapons/{weaponId}',
        handler: getWeaponByIdHandler,
        options: {
          auth: false,
          validate: {
            params: Joi.object({
              weaponId: Joi.number().integer()
            }),
            failAction: (request, h, err) => {
              // show validation errors to user https://github.com/hapijs/hapi/issues/3706
              throw err;
            }
          }
        }
      }
    ]);
  }
};

const getWeaponsHandler = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app;

  try {
    const weapons = await prisma.weapon.findMany();

    return h.response(weapons).code(200);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to fetch weapons');
  }
};

type WeaponsInput = {
  ids: number[];
};

const getWeaponsByIdsHandler = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app;
  const { ids } = request.payload as WeaponsInput;

  try {
    const weapons = await prisma.weapon.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    return h.response(weapons).code(200);
  } catch (error) {
    request.log('error', error);
    return Boom.badImplementation('failed to fetch weapons');
  }
};

const getWeaponByIdHandler = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app;
  const { weaponId } = request.params;

  try {
    const weapon = await prisma.weapon.findUnique({
      where: { id: parseInt(weaponId, 10) },
      include: {
        stats: true
      }
    });

    if (!weapon) {
      request.log('Weapon not found');
      return Boom.notFound('Weapon not found');
    }

    return h.response(weapon).code(200);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to fetch weapons');
  }
};

export default plugin;
