const fs = require("fs"); //html을 가져올 수 있음
const main_view = fs.readFileSync("./main.html", "utf-8");
const orderlist_view = fs.readFileSync("./orderlist.html");

const mariadb = require("./database/connect/mariadb");

function main(response) {
  console.log("main");

  mariadb.query("SELECT * FROM product", function (err, rows) {
    console.log(rows);
  });

  response.writeHead(200, { "Content-Type": "text/html" });
  response.write(main_view);
  response.end();
}

function redRacket(response) {
  fs.readFile("./img/redRacket.png", function (err, data) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(data);
    response.end();
  });
}

function blueRacket(response) {
  fs.readFile("./img/blueRacket.png", function (err, data) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(data);
    response.end();
  });
}

function blackRacket(response) {
  fs.readFile("./img/blackRacket.png", function (err, data) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(data);
    response.end();
  });
}

/* css파일을 읽어오기 위한 핸들러 */
function cssHandler(response) {
  fs.readFile("./main.css", function (err, data) {
    if (err) {
      response.writeHead(404);
      response.end("CSS file not found");
      return;
    }
    response.writeHead(200, { "Content-Type": "text/css" }); // CSS 파일의 Content-Type을 설정
    response.write(data);
    response.end();
  });
}

function order(response, productId) {
  response.writeHead(200, { "Content-Type": "text/html" });

  mariadb.query(
    "INSERT INTO orderlist VALUES(" +
      productId +
      ",'" +
      new Date().toLocaleDateString() +
      "');",
    function (err, rows) {
      console.log(rows);
    }
  );

  response.write("order page");
  response.end();
}

function orderlist(response) {
  console.log("orderlist");
  response.writeHead(200, { "Content-Type": "text/html" });

  mariadb.query("SELECT * FROM orderlist", function (err, rows) {
    response.write(orderlist_view);
    rows.forEach((element) => {
      response.write(
        "<tr>" +
          "<td>" +
          element.product_id +
          "</td>" +
          "<td>" +
          element.order_date +
          "</td>" +
          "</tr>"
      );
    });

    response.write("</table>");
    response.end();
  });
}

let handle = {}; //key:value
handle["/"] = main; //함수 호출하는거임
handle["/order"] = order;
handle["/orderlist"] = orderlist;

/* img directory */
handle["/img/redRacket.png"] = redRacket;
handle["/img/blueRacket.png"] = blueRacket;
handle["/img/blackRacket.png"] = blackRacket;

handle["/main.css"] = cssHandler;
exports.handle = handle;
