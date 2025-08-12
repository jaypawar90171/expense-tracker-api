import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    //is should be the ip address or the userId of the user which is unique
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res
        .status(429)
        .send({ msg: "Too many request, please try again later" });
    }

    next();
  } catch (error) {
    console.log("Rate Limiting Error");
    next(error);
  }
};

export default rateLimiter;
