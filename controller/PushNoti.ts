import Expo, { ExpoPushMessage, ExpoPushReceipt } from "expo-server-sdk";

//새로운 Expo sdk 클라이언트를 만든다.
let expo = new Expo();
//expo 서버를 거쳐 클라이언트에게 배분하고 싶은 메세지들.
let messages: ExpoPushMessage[] = [];

//somePushTokens들은 같은 챗방에 있는 모든 유저들의 pushTokens. 데이터베이스에서 검색해 와야 한다.
let somePushTokens: any[] = []; //db에서 긁어오는 함수 만들기
for (let pushToken of somePushTokens) {
  //각각의 푸쉬토큰은 ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]처럼 보인다.

  // 모든 푸쉬토큰들이 엑스포푸쉬토큰으로 유효한지 체크.
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    continue;
  }

  //유효하면 메세지 배열에 해당 데이터를 추가함.
  messages.push({
    to: pushToken,
    sound: "default",
    body: "This is a test notification", //알람창에 띄울 메세지.
    data: { withSome: "data" }
  });
}

//메세지들은 한꺼번에 보내기 위해,
let chunks = expo.chunkPushNotifications(messages);
let tickets: any[] = [];
(async () => {
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }
})();

//expo가 푸쉬알림 서비스를 애플 혹은 구글에게 전달 해 준 이후에, 각각의 알림에 대한 receipt영수증이 생성된다.
//이 영수증들은 최소 하루이상 보관되며, 오래된 영수증들은 삭제된다.
//
//각각의 영수증의 ID는 각 알림을 위한 리스폰스 티켓에 담겨 오는데,
//간단히 알림을 보낸다는건, 후에 영수증을 얻기 위해 사용 되어질 영수증 ID를 포함한 티켓을 생성한다는 것이다.
//
//영수증은 가끔 반드시 해결해야 할 에러코드를 포함한다. 특히 애플이나 구글이 알림이 차단되었거나 앱이 삭제된 디바이스에 알림을 보내는 앱들을 차단 할 수 있다.
//expo는 이와 관련해서는 어떠한 조정을 하지 않으며, 애플이나 구글에 피드백을 보내지도 않는다. 그러니 알아서 잘~해라.

let receiptIds = [];
for (let ticket of tickets) {
  // NOTE: Not all tickets have IDs; for example, tickets for notifications
  // that could not be enqueued will have error information and no receipt ID.
  if (ticket.id) {
    receiptIds.push(ticket.id);
  }
}

let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
(async () => {
  // Like sending notifications, there are different strategies you could use
  // to retrieve batches of receipts from the Expo service.
  for (let chunk of receiptIdChunks) {
    try {
      let receipts: any = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log(receipts);

      // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.
      for (let receipt of receipts) {
        if (receipt.status === "ok") {
          continue;
        } else if (receipt.status === "error") {
          console.error(
            `There was an error sending a notification: ${receipt.message}`
          );
          if (receipt.details && receipt.details.error) {
            console.error(`The error code is ${receipt.details.error}`);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
})();
