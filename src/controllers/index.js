function sum(a, b) {
  return a + b;
}

class IndexController {
  getIndex(req, res) {
    res.send("Welcome to the SAIV backend!");
  }
}

module.exports = { IndexController, sum };
