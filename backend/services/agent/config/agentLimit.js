import redis from "../../../shared/redis/redis.js";

const Limits = {
  chat: 20,
  coding: 5,
  pdf: 5,
  ppt: 5,
  image: 5,
  search: 5,
};

export const checkAgentLimit = async (userId, agent) => {
  const maxLimit = Limits[agent] || Limits["chat"];

  const key = `rate:${userId}_${agent}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 3 * 60);
  }

  const ttl = await redis.ttl(key); //time to live

  if (count > maxLimit) {
    const minutes = Math.floor(ttl / 60);
    const seconds = ttl % 60;
    const time =
      minutes > 0
        ? `${minutes} minutes ${seconds} seconds`
        : `${seconds} seconds`;

    const error = new Error();

    error.status = 429; // Too Many Requests
    error.data = {
      success: false,
      agent,
      limit: maxLimit,
      remainingTime: ttl,
      retryAfter: time,
      message: `You have exceeded the limit for ${agent} agent. Please wait for ${time} before trying again.`,
    };

    throw error;
  }

  return {
    remaining: maxLimit - count,
    limit: maxLimit,
  };
};
