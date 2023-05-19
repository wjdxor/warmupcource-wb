import { atom, selector, selectorFamily } from "recoil";


export const boardPosts = atom({
    key: 'boardPosts',
    default: []
});

// view
export const postByIdSelector = selectorFamily({
  key: 'postByIdSelector',
  get: (id) => ({ get }) => {
    const posts = get(boardPosts);
    return posts.find((post) => post.id === id);
  },
});
