
import { writeFileSync } from "fs";
import { createOrder, getChannel, submitUtr } from "./service";
import { getRandomInt, randomPayCode } from "./utils/utils";
// 这是一个非常基础的命令行参数解析
const args = process.argv.slice(2);
const command = args[0];

(async () => {
  switch (command) {
    case "getChannel":
      console.log("--- 开始获取支持的渠道 ---");
      const channel = await getChannel();
      writeFileSync("./channel.json", JSON.stringify(channel, null, 2));
      console.log("--- 写入文件成功 ---");

      break;

    case "create-order":
      const params = {
        currencyName: "INRFIAT",
        method: "McgPay_INR",
        wayName: "FIAT",
        channel: "UPI",
        amount: getRandomInt(500, 50000).toString(),
        kycItem: {},
      };
      console.log("--- 开始执行创建订单测试 ---");
      try {
        const utr = randomPayCode();

        const res = await createOrder(params);

        console.log(params, utr, res.tradeNo);

        submitUtr(res.tradeNo, utr)
          .then(async (res) => {
            console.log("submit : ", await res.json());
          })
          .catch((err) => {
            console.log("submit catch", err);
          });
      } catch (error) {
        console.log("创建订单失败:", error);
      }

      console.log("--- 创建订单测试执行完毕 ---");
      break;
    default:
      console.log("未知命令。可用命令: getChannel, create-order");
      break;
  }
})();
