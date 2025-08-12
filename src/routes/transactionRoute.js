import express from "express";
import { sql } from "../config/db.js";
const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    const result =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId}`;
    if (!result) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log("Error at fetching the transaction", error.message);
    return res.status(500).json({ msg: "Internal Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const result =
      await sql`INSERT INTO transactions(user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;

    console.log(result);
    return res.status(201).json({ msg: result });
  } catch (error) {
    console.log("Error creating the transaction", error);
    return res.status(500).json({ msg: "Internal Error" });
  }
});

router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).send({ msg: "UserId is required" });

  const result =
    await sql`DELETE FROM transactions WHERE user_id = ${userId} RETURNING *`;
  console.log(result);
  return res.status(200).send({ msg: "User Deleted Successfully" });
});

router.get("/", async (req, res) => {
  try {
    const result = await sql`SELECT * FROM transactions`;
    if (!result)
      return res.status(400).send({ msg: "Error in getting transactions" });

    return res.status(200).json(result);
  } catch (error) {
    console.log("Error creating the transaction", error);
    return res.status(500).json({ msg: "Internal Error" });
  }
});

router.get("/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as balance from transactions where user_id = ${userId}`;
    if (!balanceResult)
      return res
        .status(400)
        .send({ msg: "Balance cannot be found for the specified user" });

    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as income from transactions where user_id = ${userId} AND amount > 0`;
    if (!balanceResult)
      return res
        .status(400)
        .send({ msg: "Balance cannot be found for the specified user" });

    const expenseResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as expense from transactions where user_id = ${userId} AND amount < 0`;
    if (!balanceResult)
      return res
        .status(400)
        .send({ msg: "Balance cannot be found for the specified user" });

    console.log(balanceResult);
    console.log(incomeResult);
    console.log(expenseResult);

    return res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (error) {
    console.log("Error in getting summary of the transaction", error);
    return res.status(500).json({ msg: "Internal Error" });
  }
});

export default router;
