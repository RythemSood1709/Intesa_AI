import axios from "axios";

export const deductCredits = async (userId, agent) => {
  try {
    const { data } = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/deduct-credits`,
      { userId, agent },
    );

    return data;
  } catch (error) {
    console.error(
      "Credit deduction failed:",
      error.response?.data?.message || error.message,
    );
    return null;
  }
};
