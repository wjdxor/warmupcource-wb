import { atom, selector, selectorFamily } from "recoil";


export const boardPosts = atom({
    key: 'boardPosts',
    default: []
});

// postList
// export const postList = selector({
//   key: 'postList',
//   get:  async ({ get}) => {
//     get(boardPosts);
//     const response = axios.get(`${process.env.NEXT_PUBLIC_API_URL + process.env.NEXT_PUBLIC_API_GET_POSTS}`
//                             , {headers: {Authorization: `Bearer ${accessToken}`}})
//     return response.data;
//   }
// });


// view
export const postByIdSelector = selectorFamily({
  key: 'postByIdSelector',
  get: (id) => ({ get }) => {
    const posts = get(boardPosts);
    return posts.find((post) => post.id === id);
  },
});

