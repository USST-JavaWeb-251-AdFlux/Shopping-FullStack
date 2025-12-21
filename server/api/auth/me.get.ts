import { getUserFromEvent } from '~/server/utils/auth';

export default defineEventHandler((event) => {
  const user = getUserFromEvent(event);
  return { user };
});
