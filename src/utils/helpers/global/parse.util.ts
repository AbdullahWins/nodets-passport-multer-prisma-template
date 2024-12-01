// src/utils/helpers/global/parse.util.ts

//parse request data
// export const parseRequestData = (body: any) => {
//   return body && body.data ? JSON.parse(body.data) : {};
// };

//parse pagination query
export const parseQueryData = (query: any): { page: number; limit: number } => {
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
  return { page, limit };
};

