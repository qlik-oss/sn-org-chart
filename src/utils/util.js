export default function isOnlyLeafs(children) {
  for (let i = 0; i < children.length; ++i) {
    if (children[i].children !== undefined) {
      return false;
    }
  }
  return true;
}
