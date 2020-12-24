import { NextApiRequest, NextApiResponse } from 'next'
import Joi from 'joi'
import { pool } from '@db'
import { PostDAL } from '@components/posts'

type AvailableMethodResolvers = 'GET' | 'PUT' | 'DELETE';

const idValidator = Joi.number().min(1).required();

export default async function postsByIdHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const validationResult = idValidator.validate(req.query.postId);
  
  if (validationResult.error) {
    return res.status(400).json({
      message: 'Invalid post id argument'
    });
  }
  
  const postId: number = validationResult.value;
  
  switch (req.method as AvailableMethodResolvers) {
    case 'GET':
      return getById(req, res, postId);
      break;
    case 'PUT':
      return putById(req, res, postId);
      break;
    case 'DELETE':
      return deleteById(req, res, postId);
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res
        .status(405)
        .json({
          message: 'Wrong HTTP method'
        });
      break;
  }
}

async function getById(
  req: NextApiRequest,
  res: NextApiResponse,
  postId: number
) {
  try {
    const postDAL = new PostDAL(pool);
    const post = await postDAL.getPostById(postId);

    if (post) {
      return res.json(post);
    } else {
      return res
        .status(404)
        .json({
          message: 'Post with given id not found'
        });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message: 'Something went wrong'
      });
  }
}

async function putById(
  req: NextApiRequest,
  res: NextApiResponse,
  postId: number
) {

}

async function deleteById(
  req: NextApiRequest,
  res: NextApiResponse,
  postId: number
) {
  try {
    const postDAL = new PostDAL(pool);
    const isDeleted = await postDAL.deletePost(postId);

    if (isDeleted) {
      return res.json({
        status: 'OK',
        message: `Post with id #${postId} deleted`
      });
    } else {
      return res
        .status(404)
        .json({
          message: 'Post with given id not found'
        });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        message: 'Something went wrong'
      });
  }
}