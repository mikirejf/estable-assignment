let currentId = 0;

export default function getUniqueId(prefix = 'unique_id') {
  const id = `${prefix}-${currentId}`;
  currentId += 1;
  return id;
}
