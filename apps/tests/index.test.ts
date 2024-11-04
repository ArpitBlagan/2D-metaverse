import axios from "axios";

describe("sum function", () => {
  it("should add two numbers correctly", () => {
    expect(1 + 2).toBe(3);
  });
});

describe("authentication", () => {
  test("try registering user, login, wrong login etc", async () => {
    const res = await axios.post("", {
      username: "",
      email: "",
      password: "",
    });
    expect(res.status).toBe(202);
    await axios.post("", {
      email: "",
      password: "",
    });
    expect(res.status).toBe(200);
    await axios.post("", {
      email: "",
      password: "HEHEHE",
    });
    expect(res.status).toBe(403);
  });
});

async function waitForIncomingMessageAndPop(messagesArr: any[]) {
  await new Promise((r) => {
    if (messagesArr.length > 0) {
      r(messagesArr.shift());
    } else {
      let interval = setInterval(() => {
        if (messagesArr.length > 0) {
          r(messagesArr.shift());
          clearInterval(interval);
        }
      }, 100);
    }
  });
}

describe("ws checkup", () => {
  let ws1: WebSocket;
  let ws2: WebSocket;
  let messages1: any[];
  let messages2: any[];
  beforeAll(async () => {
    //Simple create two ws connection to check its working properly
    ws1 = new WebSocket("");
    ws1.onmessage = (event) => {
      const message = JSON.parse(event.data);
      messages1.push(message);
    };
    await new Promise((r) => {
      ws1.onopen = r;
    });
    ws2 = new WebSocket("");
    ws2.onmessage = (event) => {
      const message = JSON.parse(event.data);
      messages2.push(message);
    };
    await new Promise((r) => {
      ws2.onopen = r;
    });
  });
  test("try joining an arena", async () => {
    ws1.send(
      JSON.stringify({
        type: "join-arena",
      })
    );
    const message1: any = await waitForIncomingMessageAndPop(messages1);
    ws2.send(
      JSON.stringify({
        type: "join-arena",
      })
    );
    const message2: any = await waitForIncomingMessageAndPop(messages2);
    expect(message1.type).toBe("joined-arena");
    expect(message2.type).toBe("joined-arena");
  });

  test("test movement events", async () => {
    ws1.send(
      JSON.stringify({
        type: "movement",
      })
    );
    const message: any = await waitForIncomingMessageAndPop(messages2);
    expect(message.type).toBe("movement");
  });
  test("when some user leave the arena", async () => {
    ws1.send(
      JSON.stringify({
        type: "",
      })
    );
    const message2: any = await waitForIncomingMessageAndPop(messages2);

    expect(message2.type).toBe("user-left");
  });
});
