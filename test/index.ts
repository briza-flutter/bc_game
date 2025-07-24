import { createOrder, IChannelItem } from "../service";
import { channelSubmitInfo, } from "../src/channelSubmit";
import { getRandomInt } from "../utils/utils";
import { readFileSync } from "fs";
import { join } from "path";
async function main() {

    console.log('--- 开始创建订单 ---');

    const json = readFileSync(join(__dirname, '../channel.json'), 'utf-8');
    const channelData = JSON.parse(json) as IChannelItem[];
    const methodName = "KingsPayINR"
    const channelInfo = channelData.find(item => item.method === methodName)

    const params = {
        currencyName: "INRFIAT",
        method: channelInfo?.method ?? "",
        wayName: "FIAT",
        channel: channelInfo?.channel ?? "",
        amount: getRandomInt(500, 50000).toString(),
        kycItem: {},
    };
    const res = await createOrder(params);
    const method = res.channel;
    console.log('--- 创建订单成功 ---', method);
    channelSubmitInfo.find(item => item.method === method)?.handle(res.tradeNo, res).then((res) => {
        console.log("提交结果：", res);
    }).catch((err) => {
        console.error("提交失败：", err);
    });

}
main();
