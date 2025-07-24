import { ICreateOrderResponse } from "../service";
import { randomPayCode } from "../utils/utils";
// 相同渠道 有时候 返回的 url 不同 ，需要按收银台的url 来 处理
export const channelSubmitInfo: { method: string, handle: (orderId: string, info: ICreateOrderResponse) => Promise<any>, [key: string]: any }[] = [
    {
        method: "McgPay_INR",
        nestRequestUrl: "https://api.mcgindia.com/api/order/query",
        nestBody: { "PayerId": "3vQxWZx8B7ZtXPlOvZHXkXc1c3b4gyOy", "OrderNo": "20250724112542331029273" },
        nestObj: {
            "code": 200,
            "type": "success",
            "message": "",
            "result": {
                "orderNo": "20250724112542331029273",
                "amount": 1054.000000,
                "cashierInfo": {
                    "payment_tool": {
                        "qr": true,
                        "upi": false,
                        "gpay": false,
                        "paytm": false,
                        "phonepe": false,
                        "copy": true
                    },
                    "qr": "upi://pay?pa=9931201137@axl&pn=Payment for Captain Nikhil  Nikhil&am=1054.00&cu=INR&tid=2025072411254245883922&tn=EMZ28wEO",
                    "copy": "9931201137@axl",
                    "wakeup": {
                        "qr": "upi://pay?pa=9931201137@axl&pn=Payment for Captain Nikhil  Nikhil&am=1054.00&cu=INR&tid=2025072411254245883922&tn=EMZ28wEO"
                    }
                },
                "status": "timeout",
                "type": "inr",
                "upstreamPayUrl": "https://zise3.mcgcash.com/2025072411254200038730",
                "expireTime": 0,
                "jumpUrl": "https://bc.game"
            },
            "time": "2025-07-24 11:44:57"
        },

        submitUtr: "https://mcapi.emmapiii.com/mcapi/cash/backfillutr",
        requestMethod: "post",
        formData: {
            orderno: "2025072411474822736474",
            utr: "1234567890"
        },
        handle: McgPay_INRSubmit
    },
    {
        method: "KingsPayINR",
        url: 'https://indianpay-services.com/v9?sn=20250724122826037626293912',
        submitUtr: "https://api-in.transafe.co/payment/india/cashier/submitUtr",
        requestMethod: "post",
        body: { "sn": "20250724122826037626293912", "utr": "123123444232" },
        handle: Transafe_upiSubmit
    }, {
        handle: Transafe_upiSubmit,
        method: "Transafe",

    }
]
export async function McgPay_INRSubmit(tradeNo: string) {
    const data = await fetch("https://api.mcgindia.com/api/order/query", {
        headers: { "Content-Type": "application/json" },
        method: "POST", body: JSON.stringify({ PayerId: "3vQxWZx8B7ZtXPlOvZHXkXc1c3b4gyOy", OrderNo: tradeNo })
    })
    const res = await data.json()
    const formData = new FormData();
    formData.append("orderno", res.result.upstreamPayUrl.split("/").pop() || "");
    formData.append("utr", randomPayCode());
    console.log('formData', formData.get("orderno"), formData.get("utr"));

    const subRes = await fetch("https://mcapi.emmapiii.com/mcapi/cash/backfillutr", {
        method: "POST", body: formData
    })

    return subRes.json()
}
export async function Transafe_upiSubmit(sn: string, res: ICreateOrderResponse) {
    const url = new URL(res.data.walletUrl);
    const id = url.searchParams.get("sn") || url.searchParams.get("orderId")
    console.log('id', id);

    const subRes = await fetch("https://api-in.transafe.co/payment/india/cashier/submitUtr", {
        method: "POST", body: JSON.stringify({ sn: id, utr: randomPayCode(), orderId: id }),
    })

    return subRes.json()
} 