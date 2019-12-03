import Expo, {
  ExpoPushMessage,
  ExpoPushReceipt,
  ExpoPushToken,
  ExpoPushTicket,
  ExpoPushReceiptId
} from "expo-server-sdk";

export async function sendPushTokensToExpo(somePushTokens: ExpoPushToken[]) {
  //새로운 Expo sdk 클라이언트를 만든다.
  let expo = new Expo();
  //expo 서버를 거쳐 클라이언트에게 배분하고 싶은 메세지들.
  let messages: ExpoPushMessage[] = [];

  //somePushTokens들은 같은 챗방에 있는 모든 유저들의 pushTokens. 데이터베이스에서 검색해 와야 한다.

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
      body: "메세지가 도착했습니다.", //알람창에 띄울 메세지.
      data: { withSome: "data" }
    });
  }

  //메세지들은 한꺼번에 보내기 위해,
  let chunks = expo.chunkPushNotifications(messages);
  let tickets: any = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log("ticketChunk: ", ticketChunk);
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

  let receiptIds: any = [];
  for (let ticket of tickets) {
    // 모든 티켓들이 ID를 가지는건 아님. 예를 들자면, 큐에 더해질 수 없는 티켓들은 ID대신 error코드를 갖고 있을 것이다.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  console.log("receiptIds: ", receiptIds);

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    // noti를 보내는 것 처럼, expo서비스로부터 온 영수증 뭉치를 탐색하는 각기 다른 방법들이 있다.
    for (let chunk of receiptIdChunks) {
      try {
        let receipts: any = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        // 영수증은 구글이 noti를 성공적으로 받았는지 아니면 error코드를 받았는지, 뭐라도 받으면 그에대해 명시한다.
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
}
