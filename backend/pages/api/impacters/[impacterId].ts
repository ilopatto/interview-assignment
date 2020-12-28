import type { NextApiRequest, NextApiResponse } from 'next'
import { pool } from "@db"
import Joi from 'joi'
import { ImpacterDAL } from '@components/impacter'

type AvailableMethodResolvers = 'GET';

const idValidator = Joi.number().min(1).required();

export default async function impactersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const validationResult = idValidator.validate(req.query.impacterId);
  
  if (validationResult.error) {
    return res.status(400).json({
      message: 'Invalid impacter id'
    });
  }

  const impacterId = validationResult.value;

  switch (req.method as AvailableMethodResolvers) {
    case 'GET':
      return await get(req, res, impacterId);
      break;
    default:
      res.setHeader('Allow', 'GET');
      return res
        .status(405)
        .json({
          message: 'Wrong HTTP method'
        });
      break;
  }
}

async function get(
  req: NextApiRequest,
  res: NextApiResponse,
  impacterId: number
) {
  try {
    const impacterDAL = new ImpacterDAL(pool);
    const impacter = await impacterDAL.getImpacterById(impacterId);

    return impacter
      ? res.status(200).json(impacter)
      : res.status(404).end();
  } catch (err) {
    console.error(err);
  }

  return res.status(500).json({
    message: 'Something went wrong'
  });
}