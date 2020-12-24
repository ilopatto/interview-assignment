import type { NextApiRequest, NextApiResponse } from 'next'
import Joi from 'joi'
import { pool } from "@db"
import { Post, PostDAL } from '@components/posts'

type AvailableMethodResolvers = 'GET' | 'POST';

interface PostsQueryParams {
  limit?: number;
  offset?: number;
}

const postsQueryParamsValidator = Joi.object<PostsQueryParams>({
  limit: Joi.number().min(0),
  offset: Joi.number().min(0)
});

export default async function postsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method as AvailableMethodResolvers) {
    case 'GET':
      return get(req, res);
      break;
    case 'POST':
      return post(req, res);
      break;
    default:
      res.setHeader('Allow', 'GET,POST');
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
    let { limit, offset } = req.query;

    const validationResult = postsQueryParamsValidator.validate({
      limit,
      offset
    });

    if (validationResult.error) {
      return res.status(400).json({
        message: 'Bad query parameters'
      });
    }

    const queryParams: PostsQueryParams = validationResult.value;

    const postDAL = new PostDAL(pool);
    const posts = await postDAL.getAllPosts(queryParams);

    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
  }

  return res.status(500).json({
    message: 'Something went wrong'
  });
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  res
    .status(501)
    .json({
      message: 'Not implemented yet'
    })
}