import type { NextApiRequest, NextApiResponse } from 'next'
import { pool } from "@db"
import { Impacter, ImpacterDAL } from '@components/impacter'

type AvailableMethodResolvers = 'GET';

export default async function impactersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method as AvailableMethodResolvers) {
    case 'GET':
      return await get(req, res);
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
  res: NextApiResponse
) {
  try {
    const impacterDAL = new ImpacterDAL(pool);
    const impacters = (await impacterDAL.getAllImpacters()) ?? [];

    return res.status(200).json(impacters);
  } catch (err) {
    console.error(err);
  }

  return res.status(500).json({
    message: 'Something went wrong'
  });
}