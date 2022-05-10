export const RemoveChildren = (parent: HTMLElement) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};
