import { CreateOrder } from "../types/createOrder";
import { bcGameRequest } from "../utils/request/request";
import { generatedUUID } from "../utils/utils";

export async function getChannel(): Promise<IChannelItem[]> {
  const res = await bcGameRequest.get(
    `/api/payment/deposit/fiat/INRFIAT/methods/`
  );
  return res.json();
}

export async function createOrder(
  params: CreateOrder
): Promise<ICreateOrderResponse> {
  const res = await bcGameRequest.post(
    `/api/payment/deposit/fiat/create/`,
    params
  );
  return res.json();
}

export function submitUtr(orderId: string, utr: string) {
  const userId = generatedUUID();
  return fetch(
    `https://www.upi-payments.com/trade/cashier/submit/utr?userIdentify=${userId}&utr=${utr}&orderId=${orderId}`
  );
}
interface ICreateOrderResponse {
  orderId: string;
  tradeNo: string;
  method: string;
  expiredTime: string;
  tradeStatus: null;
  status: number;
  failCode: null;
  failReason: null;
  guideUrl: string;
  guideVideoUrl: string;
  proofGuideHtml: string;
  needUpdateUTR: boolean;
  data: IData;
  fiatTicketResult: null;
  canResubmitTicket: boolean;
  ticketCount: number;
  needKyc: boolean;
  depositCanSubmit: number;
  withdrawCanSubmit: number;
  frequencyResult: null;
  fiatProvider: string;
  channel: string;
  channelName: string;
  channelTag: string;
  channelAvgMinutesSpent: string;
  channelAvgWholeMinutesSpent: string;
  mode: number;
  createTime: string;
  reviewTime: null;
  completedTime: null;
  sendFail: boolean;
  hastenNum: number;
  grantAmount: null;
  grantTime: null;
  compensationCreateTime: null;
}

interface IData {
  walletUrl: string;
  card: null;
  payList: null;
  orderId: string;
  opt: null;
  securityCode: null;
  qrCode: null;
  qrCodeContent: null;
  payButtonUrl: null;
  payToken: null;
  instruction: null;
}

interface IChannelItem {
  supportCurrency: string;
  wayName: string;
  method: string;
  channel: string;
  provider: string;
  name: string;
  describe: string;
  lightIcon: string;
  nightIcon: string;
  sort: number;
  originalTag: string;
  tag: string;
  maintained: boolean;
  maintainedStatus: number;
  minDepositAmount: string;
  maxDepositAmount: string;
  amountList: null;
  category: string;
  categoryId: string;
  mode: number;
  guideUrl: string;
  guideVideoUrl: string;
  proofGuideHtml: string;
  guideTemplateType: number;
  avgMinutesSpent: string;
  kycRequirement: number;
  tipMessage: string;
  needRedirect: boolean;
  isIframe: number;
  env: number;
  supportedDevice: number;
  supportedMethod: string[];
}
