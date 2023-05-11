import { atom, selector } from "recoil";


export const boardPosts = atom({
    key: 'boardPosts',
    default: []
});

export const postByIdSelector = selector({
  key: 'postByIdSelector',
  get: ({ get }) => (id) => {
    const posts = get(boardPosts);
    return posts.find((post) => post.id === id);
  },
});

// export const boardPosts = atomFamily({
//   key: 'boardPosts',
//   default: [],
// });

// export const postByIdSelector = selectorFamily({
//     key: 'postByIdSelector',
//     get: (id) => ({ get }) => {
//       const posts = get(boardPosts);
//       return posts.find((post) => post.id === id);
//     },
//   });