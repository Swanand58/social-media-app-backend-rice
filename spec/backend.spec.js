require("es6-promise").polyfill();
require("isomorphic-fetch");

const url = (path) => `http://127.0.0.1:3001${path}`;

const generateRandomId = () => {
  return Math.floor(Math.random() * 10000);
};

describe("Run all backend tests", () => {
  let cookie;
  let ID = generateRandomId();
  let testusername = `testUser${ID}`;

  it("register new user", (done) => {
    console.log("Running register user");
    let regUser = {
      username: testusername,
      email: "testuser@rice.edu",
      name: "test User",
      password: "1234",
      phoneNumber: 1234567880,
      zipcode: 560088,
      dob: "12/12/1996",
    };

    fetch(url("/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regUser),
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.username).toEqual(regUser.username);
        expect(res.result).toEqual("success");
        done();
      });
  });

  it("login user", (done) => {
    let loginUser = { username: testusername, password: "1234" };

    fetch(url("/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginUser),
    })
      .then((res) => {
        cookie = res.headers.get("set-cookie");
        return res.json();
      })
      .then((res) => {
        expect(res.username).toEqual(loginUser.username);
        expect(res.result).toEqual("success");
        done();
      });
  });

  it("get headline", (done) => {
    let loginUser = { username: testusername };

    fetch(url("/headline"), {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        expect(res.username).toEqual(loginUser.username);
        expect(res.headline).toEqual("Im Loving it!");
        done();
      });
  });

  it("update headline", (done) => {
    const newHeadline = { headline: "My new headline" };
    let loginUser = { username: testusername };
    // console.log("in update headline test");
    fetch(url("/headline"), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify(newHeadline),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        expect(res.username).toEqual(loginUser.username);
        expect(res.headline).toEqual("My new headline");
        done();
      });
  });

  it("post new article", (done) => {
    var article = { title: "New Post title", text: "New Post" };
    // console.log("this test is failing, post new article test");
    fetch(url("/articles"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify(article),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        expect(res.text).toEqual(article.text);
        expect(res.author).toEqual(testusername);
        done();
      });
  });

  it("get all articles", (done) => {
    // console.log("this test is failing");
    fetch(url("/articles"), {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        expect(res.articles.length).toEqual(1);
        done();
      });
  });

  it("get article by id", (done) => {
    // let loginUser = { username: testusername };
    // console.log("this test is failing");
    fetch(url(`/articles/${testusername}`), {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        expect(res.articles.length).toEqual(1);
        done();
      });
  });

  it("logout user", (done) => {
    fetch(url("/logout"), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        expect(res.result).toEqual("log out success");
        done();
      });
  });
});
