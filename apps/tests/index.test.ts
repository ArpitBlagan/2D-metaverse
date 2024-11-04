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

describe("ws checkup", () => {
  let ws1: WebSocket;
  let ws2: WebSocket;
  beforeAll(async () => {
    //Simple create two ws connection to check its working properly
    ws1 = new WebSocket("");
    await new Promise((r) => {
      ws1.onopen = r;
    });
    ws2 = new WebSocket("");

    await new Promise((r) => {
      ws2.onopen = r;
    });
  });
});
